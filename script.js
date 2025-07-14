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
        const img = new Image();
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAVUlEQVR42u3TMQ0AAAgDILV/51G4oKAKJEg24Rjve5XEAQcABIfAERHwoOiAgiCvAAAEIEscUZgGfV5ABABAANAHQAAVBXgA0APkEBADFoAIBAcIATiMpQ+iy52cAAAAASUVORK5CYII=';
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
