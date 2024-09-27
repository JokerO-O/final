function register() {
    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();

    // Validar que los campos no estén vacíos
    if (!newUsername || !newPassword) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Comprobar si el usuario ya existe en localStorage
    if (localStorage.getItem(newUsername)) {
        alert('El nombre de usuario ya está en uso');
        return;
    }

    // Registrar el nuevo usuario en localStorage
    localStorage.setItem(newUsername, newPassword);
    alert('Usuario registrado exitosamente');

    // Limpiar campos después del registro
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validar que los campos no estén vacíos
    if (!username || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Comprobar si la contraseña coincide con el usuario almacenado
    const storedPassword = localStorage.getItem(username);
    if (storedPassword && storedPassword === password) {
        alert('Inicio de sesión exitoso');
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('password-generator').style.display = 'block';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function generatePassword() {
    const length = 12; // Longitud de la contraseña
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"; // Conjunto de caracteres permitidos
    let password = "";

    // Generar contraseña aleatoria
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    // Mostrar la contraseña generada en el elemento correspondiente
    document.getElementById('generated-password').textContent = `Contraseña generada: ${password}`;
}

// Animación de cambio de color para el texto "Generador de Contraseña"
const textElement = document.getElementById('color-changing-text');
const text = textElement.textContent;
textElement.textContent = ''; // Limpiar el texto original

// Dividir el texto en letras y aplicar animación
text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.display = 'inline-block'; // Para que cada letra sea independiente
    span.style.animationDelay = `${index * 0.1}s`; // Retraso para cada letra
    span.classList.add('color'); // Añadir clase para aplicar el estilo CSS
    textElement.appendChild(span); // Agregar cada letra al elemento
});
