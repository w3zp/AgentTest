const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const beltY = canvas.height - 120;
const beltHeight = 20;
const machineX = 80;
const ovenX = 250;
const ovenWidth = 150;
const plateX = canvas.width - 100;
const plateY = beltY + 40;

const pancakes = [];
const radius = 20;
const thickness = 12;

let stackCount = 0;

function drawConveyor() {
    ctx.fillStyle = '#555';
    ctx.fillRect(0, beltY, canvas.width, beltHeight);
}

function drawMachine() {
    ctx.fillStyle = '#999';
    ctx.fillRect(machineX - 40, beltY - 80, 80, 80);
    ctx.fillStyle = '#777';
    ctx.fillRect(machineX - 10, beltY - 90, 20, 30);
}

function drawOven() {
    ctx.fillStyle = '#b5651d';
    ctx.fillRect(ovenX, beltY - 80, ovenWidth, 80);
    ctx.fillStyle = '#ffdead';
    ctx.fillRect(ovenX + 10, beltY - 60, ovenWidth - 20, 40);
}

function drawPlate() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(plateX, plateY + 6, 60, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
}

function drawPancake(p) {
    const grad = ctx.createRadialGradient(p.x, p.y, radius / 2, p.x, p.y, radius);
    if (p.cooked) {
        grad.addColorStop(0, '#fbd28b');
        grad.addColorStop(1, '#c17d10');
    } else {
        grad.addColorStop(0, '#fff4c4');
        grad.addColorStop(1, '#e8d089');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, radius, thickness / 2, 0, 0, Math.PI * 2);
    ctx.fill();
}

function updatePancakes() {
    pancakes.forEach(p => {
        if (p.stage === 'moving') {
            p.x += 2;
            if (p.x > ovenX + ovenWidth / 2) {
                p.cooked = true;
            }
            if (p.x >= plateX) {
                p.stage = 'falling';
            }
        } else if (p.stage === 'falling') {
            const targetY = plateY - p.stackOffset;
            if (p.y < targetY) {
                p.y += 2;
            } else {
                p.y = targetY;
                p.stage = 'stacked';
            }
        }
    });
}

function spawnPancake() {
    const pancake = {
        x: machineX,
        y: beltY - radius,
        cooked: false,
        stage: 'moving',
        stackOffset: stackCount * thickness
    };
    pancakes.push(pancake);
    stackCount++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConveyor();
    drawMachine();
    drawOven();
    drawPlate();
    updatePancakes();
    pancakes.forEach(drawPancake);
    requestAnimationFrame(draw);
}

window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        spawnPancake();
    }
});

draw();
