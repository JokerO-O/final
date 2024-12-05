SECRET_KEY = 'clave_secreta_segura'
SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SESSION_TYPE = 'filesystem'
SESSION_PERMANENT = False  # Dependiendo de si quieres que la sesión sea permanente
SESSION_USE_SIGNER = True  # Opcional, para firmar las sesiones
SESSION_COOKIE_NAME = 'your_session_cookie_name'  # Define un nombre para la cookie de sesión
