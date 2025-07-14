const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const machine = {
    x: width / 2 - 150,
    y: 120,
    width: 300,
    height: 380
};

const crane = {
    x: machine.x + machine.width / 2,
    y: machine.y + 40,
    size: 30,
    holding: null
};

const items = [];
const numItems = 6;
const itemSize = 40;

for (let i = 0; i < numItems; i++) {
    items.push({
        x: Math.random() * (machine.width - itemSize) + machine.x + itemSize / 2,
        y: machine.y + machine.height - 60 - Math.random() * 120,
        caught: false
    });
}

let attempts = 0;
let message = '';

const bgOsc = new (window.AudioContext || window.webkitAudioContext)();
function startBackgroundMusic() {
    const oscillator = bgOsc.createOscillator();
    const gain = bgOsc.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 220;
    gain.gain.value = 0.05;
    oscillator.connect(gain).connect(bgOsc.destination);
    oscillator.start();
    oscillator.stop(bgOsc.currentTime + 1000);
}
startBackgroundMusic();

function playSound(win) {
    const ctxx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctxx.createOscillator();
    const gain = ctxx.createGain();
    osc.frequency.value = win ? 880 : 110;
    osc.type = 'triangle';
    gain.gain.value = 0.2;
    osc.connect(gain).connect(ctxx.destination);
    osc.start();
    osc.stop(ctxx.currentTime + 0.3);
}

function drawGraffiti() {
    for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, 60%)`;
        ctx.beginPath();
        const gx = machine.x - 20 + Math.random() * (machine.width + 40);
        const gy = machine.y - 40 + Math.random() * (machine.height + 60);
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + Math.random() * 40 - 20, gy + Math.random() * 40 - 20);
        ctx.stroke();
    }
}

function drawMachine() {
    ctx.fillStyle = '#444';
    ctx.fillRect(machine.x - 20, machine.y - 40, machine.width + 40, machine.height + 60);
    ctx.fillStyle = '#222';
    ctx.fillRect(machine.x, machine.y, machine.width, machine.height);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 4;
    ctx.strokeRect(machine.x, machine.y, machine.width, machine.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(machine.x, machine.y - 40, machine.width, 40);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("Ethan's Crane Game", machine.x + machine.width / 2, machine.y - 15);

    drawGraffiti();
}

function drawSeal(item) {
    ctx.fillStyle = '#ddd';
    ctx.beginPath();
    ctx.ellipse(item.x, item.y, itemSize * 0.8, itemSize * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(item.x + itemSize * 0.5, item.y - itemSize * 0.2, itemSize * 0.3, itemSize * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(item.x + itemSize * 0.4, item.y - itemSize * 0.25, itemSize * 0.05, 0, Math.PI * 2);
    ctx.arc(item.x + itemSize * 0.6, item.y - itemSize * 0.25, itemSize * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(item.x + itemSize * 0.5, item.y - itemSize * 0.15, itemSize * 0.06, 0, Math.PI * 2);
    ctx.fill();
}

function drawCrane() {
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(machine.x + 10, machine.y + 20);
    ctx.lineTo(machine.x + machine.width - 10, machine.y + 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(crane.x, machine.y + 20);
    ctx.lineTo(crane.x, crane.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(crane.x, crane.y);
    ctx.lineTo(crane.x - 10, crane.y + crane.size);
    ctx.lineTo(crane.x, crane.y + crane.size / 2);
    ctx.lineTo(crane.x + 10, crane.y + crane.size);
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawMachine();

    items.forEach(item => {
        if (!item.caught) {
            drawSeal(item);
        }
    });

    drawCrane();

    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'left';
    ctx.fillText(message, 20, height - 20);
}

draw();

function attemptCatch() {
    attempts++;
    const success = Math.random() < 0.25;
    items.forEach(item => {
        if (!item.caught && Math.abs(item.x - crane.x) < itemSize && Math.abs(item.y - crane.y - crane.size) < itemSize) {
            if (success) {
                item.caught = true;
            }
        }
    });
    message = success ? 'You won a seal!' : 'No luck!';
    playSound(success);
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowLeft':
            crane.x = Math.max(crane.x - 20, machine.x + 20);
            break;
        case 'ArrowRight':
            crane.x = Math.min(crane.x + 20, machine.x + machine.width - 20);
            break;
        case 'ArrowUp':
            crane.y = Math.max(crane.y - 20, machine.y + 40);
            break;
        case 'ArrowDown':
            crane.y = Math.min(crane.y + 20, machine.y + machine.height - 60);
            break;
        case ' ':
            attemptCatch();
            break;
    }
    draw();
});
