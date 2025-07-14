const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const crane = {
    x: width / 2,
    y: 50,
    size: 40,
    holding: null
};

const items = [];
const numItems = 6;
const itemSize = 30;

for (let i = 0; i < numItems; i++) {
    items.push({
        x: Math.random() * (width - itemSize) + itemSize / 2,
        y: Math.random() * (height - 200) + 200,
        caught: false
    });
}

let attempts = 0;
let successes = 0;
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
    for (let i = 0; i < 100; i++) {
        ctx.strokeStyle = `hsl(${Math.random()*360}, 100%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(Math.random()*width, Math.random()*height);
        ctx.lineTo(Math.random()*width, Math.random()*height);
        ctx.stroke();
    }
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText("Ethan's Crane Game", width/2 - 120, 40);
}

drawGraffiti();

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGraffiti();

    // Draw items
    ctx.fillStyle = '#ccc';
    items.forEach(item => {
        if (!item.caught) {
            ctx.beginPath();
            ctx.ellipse(item.x, item.y, itemSize/2, itemSize/2, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#eee';
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.fillText('seal', item.x - 12, item.y + 4);
        }
    });

    // Draw crane arm
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(crane.x, crane.y - crane.size/2);
    ctx.stroke();

    // Draw claw
    ctx.beginPath();
    ctx.moveTo(crane.x - crane.size/2, crane.y);
    ctx.lineTo(crane.x + crane.size/2, crane.y);
    ctx.moveTo(crane.x - crane.size/2, crane.y);
    ctx.lineTo(crane.x - crane.size/2, crane.y + crane.size);
    ctx.moveTo(crane.x + crane.size/2, crane.y);
    ctx.lineTo(crane.x + crane.size/2, crane.y + crane.size);
    ctx.stroke();

    // Message
    ctx.fillStyle = 'yellow';
    ctx.fillText(message, 20, height - 20);
}

draw();

function attemptCatch() {
    attempts++;
    let success = Math.random() < 0.25;
    items.forEach(item => {
        if (!item.caught && Math.abs(item.x - crane.x) < itemSize && Math.abs(item.y - crane.y) < itemSize) {
            if (success) {
                item.caught = true;
                successes++;
            }
        }
    });
    message = success ? 'You won a seal!' : 'No luck!';
    playSound(success);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            crane.x = Math.max(crane.x - 20, crane.size/2);
            break;
        case 'ArrowRight':
            crane.x = Math.min(crane.x + 20, width - crane.size/2);
            break;
        case 'ArrowUp':
            crane.y = Math.max(crane.y - 20, crane.size/2 + 40);
            break;
        case 'ArrowDown':
            crane.y = Math.min(crane.y + 20, height - crane.size);
            break;
        case ' ':
            attemptCatch();
            break;
    }
    draw();
});
