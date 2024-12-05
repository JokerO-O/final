SECRET_KEY = 'clave_secreta_segura'
SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Configuración de Flask-Session
SESSION_TYPE = 'filesystem'  # Otras opciones: 'redis', 'memcached', etc.
SESSION_PERMANENT = False  # Para sesiones no permanentes
SESSION_USE_SIGNER = True  # Opcional, para firmar las sesiones
SESSION_COOKIE_NAME = 'session'

