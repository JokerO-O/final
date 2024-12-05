let score = 0;
let gameInterval;
let duckInterval;
let gameActive = false;
let gameTime = 0;
let duckSpeed = 1500; // Tiempo inicial para que aparezca un pato
let timerInterval;

const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

function spawnDuck() {
  if (!gameActive) return;

  const duck = document.createElement('div');
  duck.classList.add('duck');
  
  // Posicionar el pato aleatoriamente dentro del área de juego
  const randomX = Math.floor(Math.random() * (gameArea.offsetWidth - 60));
  const randomY = Math.floor(Math.random() * (gameArea.offsetHeight - 60));
  
  duck.style.left = `${randomX}px`;
  duck.style.top = `${randomY}px`;

  // Cuando el jugador hace clic en el pato
  duck.addEventListener('click', () => {
    if (gameActive) {
      score++;
      scoreDisplay.textContent = `Puntos: ${score}`;
      duck.remove(); // Eliminar el pato cuando se hace clic
    }
  });

  gameArea.appendChild(duck);

  // Eliminar el pato si no se clickea en un tiempo determinado
  setTimeout(() => {
    if (duck.parentElement) {
      duck.remove();
    }
  }, 2000);
}

function updateTime() {
  if (!gameActive) return;

  gameTime++;
  let remainingTime = 30 - gameTime; // El juego dura 30 segundos
  timeDisplay.textContent = `Tiempo: ${remainingTime}s`;

  // Aumentar la velocidad de los patos conforme pasa el tiempo
  if (gameTime % 5 === 0 && duckSpeed > 500) {
    duckSpeed -= 100; // Disminuir el tiempo de aparición del pato
    clearInterval(duckInterval); // Detener el intervalo actual
    duckInterval = setInterval(spawnDuck, duckSpeed); // Iniciar un nuevo intervalo con la nueva velocidad
  }

  if (gameTime >= 30) {
    endGame();
  }
}

function startGame() {
  score = 0;
  scoreDisplay.textContent = `Puntos: ${score}`;
  gameActive = true;
  gameOverScreen.style.display = 'none';
  gameTime = 0;
  duckSpeed = 1500;
  
  // Iniciar el juego con los patos apareciendo
  duckInterval = setInterval(spawnDuck, duckSpeed);
  
  // Iniciar el cronómetro
  timerInterval = setInterval(updateTime, 1000);

  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function stopGame() {
  gameActive = false;
  clearInterval(duckInterval);
  clearInterval(timerInterval);
  gameOverScreen.style.display = 'block';
  finalScore.textContent = `Puntos finales: ${score}`;
  
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function endGame() {
  gameActive = false;
  clearInterval(duckInterval);
  clearInterval(timerInterval);
  gameOverScreen.style.display = 'block';
  finalScore.textContent = `Puntos finales: ${score}`;
  
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function restartGame() {
  gameOverScreen.style.display = 'none';
  startGame();
}

// Asignar los botones
startBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', stopGame);

// Iniciar el juego al cargar la página
window.onload = () => {
  startBtn.disabled = false;
  stopBtn.disabled = true;
};
