function register() {
    const newUsername = document.getElementById('new-username').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();

    if (!newUsername || !newPassword) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Comprobar si el usuario ya existe
    if (localStorage.getItem(newUsername)) {
        alert('El nombre de usuario ya está en uso');
        return;
    }

    // Registrar el nuevo usuario
    localStorage.setItem(newUsername, newPassword);
    alert('Usuario registrado exitosamente');

    // Limpiar campos después del registro
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
}

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

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
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    document.getElementById('generated-password').textContent = `Contraseña generada: ${password}`;
}
