const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const addElementsButton = document.getElementById("addElementsButton");
const inputElements = document.getElementById("inputElements");
const winnerDisplay = document.getElementById("winnerDisplay");

let segments = ["Premio 1", "Premio 2", "Premio 3", "Premio 4", "Premio 5", "Premio 6"];
let colors = ["#FF5733", "#33FF57", "#3357FF", "#57FF33", "#FF33A1", "#FF9633"];
let startAngle = 0;
let arc = Math.PI / (segments.length / 2);
let spinTimeout = null;
let spinAngle = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let isSpinning = false;

function drawWheel() {
    ctx.clearRect(0, 0, 500, 500);
    const radius = 200;
    arc = Math.PI * 2 / segments.length;

    ctx.font = "14px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    segments.forEach((segment, index) => {
        const angle = startAngle + index * arc;
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.arc(250, 250, radius, angle, angle + arc, false);
        ctx.lineTo(250, 250);
        ctx.fill();

        // Dibujar el texto
        const textAngle = angle + arc / 2;
        ctx.save();
        ctx.translate(250 + Math.cos(textAngle) * radius / 2, 250 + Math.sin(textAngle) * radius / 2);
        ctx.rotate(textAngle + Math.PI / 2);
        ctx.fillStyle = "white";
        ctx.fillText(segment, 0, 0);
        ctx.restore();
    });
}

function spinWheel() {
    spinTime += 30;

    if (spinTime >= spinTimeTotal) {
        alignWinner();
        return;
    }

    spinAngle *= 0.97; // Reduce la velocidad gradualmente
    startAngle += spinAngle * Math.PI / 180;
    drawWheel();
    spinTimeout = setTimeout(spinWheel, 30);
}

function alignWinner() {
    const randomIndex = Math.floor(Math.random() * segments.length);
    const winningAngle = (3 * Math.PI / 2) - (randomIndex * arc);
    const angleDifference = (winningAngle - startAngle + Math.PI * 2) % (Math.PI * 2);

    // Ajuste final suave
    const adjustmentTime = 2000; // Tiempo para alinear suavemente
    const adjustmentSteps = adjustmentTime / 30;
    const adjustmentIncrement = angleDifference / adjustmentSteps;

    let currentStep = 0;

    function smoothAlign() {
        if (currentStep < adjustmentSteps) {
            startAngle += adjustmentIncrement;
            drawWheel();
            currentStep++;
            setTimeout(smoothAlign, 30);
        } else {
            const winner = segments[randomIndex];
            winnerDisplay.textContent = `¡Has ganado: ${winner}!`;
            isSpinning = false;
        }
    }

    smoothAlign();
}

// Añadir nuevos elementos desde el input
addElementsButton.addEventListener("click", () => {
    const inputText = inputElements.value.trim();
    if (inputText) {
        const newElements = inputText.split(/\s+/);
        segments = newElements;
        colors = newElements.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
        drawWheel();
    }
    inputElements.value = "";
});

// Girar la ruleta
spinButton.addEventListener("click", () => {
    if (isSpinning) return;
    if (segments.length === 0) {
        alert("¡Añade elementos antes de girar!");
        return;
    }
    isSpinning = true;
    spinAngle = Math.random() * 50 + 100;
    spinTime = 0;
    spinTimeTotal = 3000;
    spinWheel();
});

// Dibujar la ruleta inicial
drawWheel();
