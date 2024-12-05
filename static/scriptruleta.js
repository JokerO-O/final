function girarRuleta() {
    // Generar un valor aleatorio para el giro
    const gradosAleatorios = Math.floor(Math.random() * 360) + 3600; // Mínimo 10 giros completos (3600 grados)
    
    // Aplicar la animación de rotación
    const ruleta = document.querySelector('.ruleta');
    ruleta.style.transition = 'transform 4s ease-out';
    ruleta.style.transform = `rotate(${gradosAleatorios}deg)`;
    
    // Desactivar la animación después de que termine
    setTimeout(() => {
        ruleta.style.transition = '';
        const resultado = Math.floor((gradosAleatorios % 360) / 45) + 1; // Definir el número resultante
        alert(`¡Ha salido el número: ${resultado}!`);
    }, 4000); // 4 segundos para que termine la animación
}
