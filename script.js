function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí puedes agregar tu lógica de autenticación.
    if (username === 'admin' && password === 'password') {
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
