from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_session import Session
from datetime import datetime
import random, os
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, Length
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import pytz


# Formulario de inicio de sesión
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])

# Formulario de registro de usuario
class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), Length(min=6)])

# Configuración inicial
app = Flask(__name__)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)
login_manager = LoginManager(app)
Session(app)

# Modelos
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    tz = pytz.timezone('America/Santo_Domingo')
    last_login = db.Column(db.DateTime, default=None)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def get_last_login_in_timezone(self):
        """Convierte last_login a la zona horaria RD antes de mostrarlo."""
        if self.last_login:
            # Convertimos el datetime a la zona horaria de RD
            local_time = self.last_login.astimezone(self.tz)
            return local_time.strftime('%Y-%m-%d %H:%M:%S')  # Puedes cambiar el formato
        return None
    
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    operation = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('history', lazy=True))

# Configurar directorios


# Cargar el usuario por ID
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Rutas
@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            # Guardar la hora actual en UTC y luego convertir a RD
            user.last_login = datetime.now(pytz.utc)  # Almacena la hora en UTC
            db.session.commit()
            login_user(user)
            session['user'] = user.username
            return redirect(url_for('dashboard'))
        flash('Credenciales incorrectas.')
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        username = form.username.data
        email = form.email.data
        password = form.password.data
        confirm_password = form.confirm_password.data

        if password != confirm_password:
            flash('Las contraseñas no coinciden.')
            return redirect(url_for('register'))

        if User.query.filter_by(username=username).first():
            flash('El nombre de usuario ya existe.')
            return redirect(url_for('register'))

        if User.query.filter_by(email=email).first():
            flash('El correo electrónico ya está registrado.')
            return redirect(url_for('register'))

        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        flash('Usuario registrado exitosamente. Ahora puedes iniciar sesión.')
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/dashboard')
@login_required
def dashboard():
    # Usamos el método para obtener la última conexión ajustada a la zona horaria
    last_login = current_user.get_last_login_in_timezone()
    return render_template('dashboard.html', last_login=last_login)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    session.pop('user', None)
    return redirect(url_for('login'))

@app.route('/ruleta')
@login_required
def ruleta():
    premios = ['Premio 1', 'Premio 2', 'Premio 3']
    resultado = random.choice(premios)
    return render_template('ruleta.html', resultado=resultado)

@app.route('/calculadora')
@login_required
def calculadora():
    return render_template('calculadora.html')

@app.route('/save_history', methods=['POST'])
@login_required
def save_history():
    data = request.get_json()
    operation = data.get('operation')
    if operation:
        history_entry = History(operation=operation, user_id=current_user.id)
        db.session.add(history_entry)
        db.session.commit()
    user_history = History.query.filter_by(user_id=current_user.id).all()
    history = [entry.operation for entry in user_history]
    return {"history": history}

@app.route('/get_history', methods=['GET'])
@login_required
def get_history():
    user_history = History.query.filter_by(user_id=current_user.id).all()
    history = [entry.operation for entry in user_history]
    return {"history": history}

@app.route('/clear_history', methods=['POST'])
@login_required
def clear_history():
    History.query.filter_by(user_id=current_user.id).delete()
    db.session.commit()
    return {"history": []}

@app.route('/generador', methods=['GET', 'POST'])
@login_required
def generador():
    if request.method == 'POST':
        longitud = int(request.form['longitud'])
        caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
        password = ''.join(random.choices(caracteres, k=longitud))
        return render_template('generador.html', password=password)
    return render_template('generador.html')

@app.route('/juego')
@login_required
def juego():
    return render_template('juego.html')

# Crear base de datos y usuario de ejemplo si no existe
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='admin').first():
            new_user = User(username='admin', email='admin@example.com')
            new_user.set_password('1234')
            db.session.add(new_user)
            db.session.commit()
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)



