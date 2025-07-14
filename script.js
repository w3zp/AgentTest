const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const clawWidth = 40;
const clawHeight = 20;
let clawX = canvas.width / 2;
let clawY = 50;
let dropping = false;
let dropProgress = 0;
let attempts = 0;
let wins = 0;

const seals = [];
const sealRadius = 20;
const maxSeals = 5;

function initSeals() {
    for (let i = 0; i < maxSeals; i++) {
        const x = 80 + Math.random() * (canvas.width - 160);
        const y = canvas.height - 80 - Math.random() * 40;
        seals.push({ x, y, caught: false });
    }
}

function drawMachine() {
    ctx.fillStyle = '#ccc';
    ctx.fillRect(100, 80, canvas.width - 200, canvas.height - 160);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 80, canvas.width - 200, canvas.height - 160);
}

function drawSeals() {
    seals.forEach(seal => {
        if (!seal.caught) {
            const img = getSealImage();
            ctx.drawImage(img, seal.x - sealRadius, seal.y - sealRadius, sealRadius * 2, sealRadius * 2);
        }
    });
}

function drawClaw() {
    ctx.fillStyle = '#666';
    ctx.fillRect(clawX - clawWidth / 2, clawY - clawHeight, clawWidth, clawHeight);
    ctx.fillRect(clawX - 5, 0, 10, clawY - clawHeight);
}

function getSealImage() {
    if (!getSealImage.cache) {
        const off = document.createElement('canvas');
        off.width = 64;
        off.height = 64;
        const octx = off.getContext('2d');

        // body
        const bodyGradient = octx.createRadialGradient(32, 40, 10, 32, 40, 28);
        bodyGradient.addColorStop(0, '#f0f0f0');
        bodyGradient.addColorStop(1, '#777');
        octx.fillStyle = bodyGradient;
        octx.beginPath();
        octx.ellipse(32, 42, 24, 18, 0, 0, Math.PI * 2);
        octx.fill();

        // head
        const headGradient = octx.createRadialGradient(32, 26, 5, 32, 26, 15);
        headGradient.addColorStop(0, '#ffffff');
        headGradient.addColorStop(1, '#888');
        octx.fillStyle = headGradient;
        octx.beginPath();
        octx.ellipse(32, 26, 12, 10, 0, 0, Math.PI * 2);
        octx.fill();

        // flippers
        octx.fillStyle = '#888';
        octx.beginPath();
        octx.ellipse(16, 48, 8, 4, 0, 0, Math.PI * 2);
        octx.fill();
        octx.beginPath();
        octx.ellipse(48, 48, 8, 4, 0, 0, Math.PI * 2);
        octx.fill();

        // eyes and nose
        octx.fillStyle = '#000';
        octx.beginPath();
        octx.arc(28, 24, 2, 0, Math.PI * 2);
        octx.fill();
        octx.beginPath();
        octx.arc(36, 24, 2, 0, Math.PI * 2);
        octx.fill();
        octx.beginPath();
        octx.arc(32, 30, 2, 0, Math.PI * 2);
        octx.fill();

        // simple whiskers
        octx.strokeStyle = '#000';
        octx.lineWidth = 1;
        octx.beginPath();
        octx.moveTo(32, 30);
        octx.lineTo(24, 32);
        octx.moveTo(32, 30);
        octx.lineTo(40, 32);
        octx.stroke();

        const img = new Image();
        img.src = off.toDataURL();
        getSealImage.cache = img;
    }
    return getSealImage.cache;
}

function playSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMachine();
    drawSeals();
    if (dropping) {
        dropProgress += 5;
        clawY = 50 + dropProgress;
        if (clawY >= canvas.height - 100) {
            checkCatch();
            dropping = false;
            clawY = 50;
            dropProgress = 0;
        }
    }
    drawClaw();
    requestAnimationFrame(update);
}

function checkCatch() {
    attempts++;
    const threshold = 30;
    for (const seal of seals) {
        if (!seal.caught) {
            const dx = seal.x - clawX;
            const dy = seal.y - (canvas.height - 100);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < threshold) {
                if (Math.random() < 0.33) {
                    seal.caught = true;
                    wins++;
                    playSound();
                    alert('You won! Total wins: ' + wins + '/' + attempts);
                } else {
                    playSound();
                    alert('Close! Try again.');
                }
                return;
            }
        }
    }
    playSound();
    alert('Miss!');
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        clawX = Math.max(120, clawX - 20);
    } else if (e.key === 'ArrowRight') {
        clawX = Math.min(canvas.width - 120, clawX + 20);
    } else if (e.key === ' ') {
        if (!dropping) {
            dropping = true;
        }
    }
});

initSeals();
update();
