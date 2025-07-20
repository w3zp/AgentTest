const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const beltY = canvas.height - 120;
const beltHeight = 20;
const machineX = 80;
const ovenX = 250;
const ovenWidth = 150;
const plateX = canvas.width - 250;
const plateY = beltY + 40;

// load images for a slightly more "photorealistic" look
const images = {
    belt: Object.assign(new Image(), { src: BELT_IMG }),
    machine: Object.assign(new Image(), { src: MACHINE_IMG }),
    oven: Object.assign(new Image(), { src: OVEN_IMG }),
    plate: Object.assign(new Image(), { src: PLATE_IMG }),
    seal: Object.assign(new Image(), { src: SEAL_IMG }),
    pancake: Object.assign(new Image(), { src: PANCAKE_IMG })
};

const pancakes = [];
const radius = 20;
const thickness = 12;
let leverPressFrames = 0;

function ellipsePath(x, y, rx, ry) {
    if (typeof ctx.ellipse === 'function') {
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    } else {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(rx, ry);
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.restore();
    }
}

let stackCount = 0;
let captionEndTime = 0;

function drawConveyor() {
    if (images.belt.complete) {
        ctx.drawImage(images.belt, 0, beltY, canvas.width, images.belt.height);
    } else {
        ctx.fillStyle = '#555';
        ctx.fillRect(0, beltY, canvas.width, beltHeight);
    }
}

function drawMachine() {
    const w = 80, h = 80;
    if (images.machine.complete) {
        ctx.drawImage(images.machine, machineX - 40, beltY - h, w, h);
    } else {
        ctx.fillStyle = '#999';
        ctx.fillRect(machineX - 40, beltY - h, w, h);
    }
    ctx.save();
    ctx.translate(machineX + 40, beltY - 70);
    const angle = leverPressFrames > 0 ? Math.PI / 4 : 0;
    ctx.rotate(angle);
    ctx.fillStyle = '#444';
    ctx.fillRect(0, -5, 40, 10);
    ctx.restore();
}

function drawOven() {
    const h = 80;
    if (images.oven.complete) {
        ctx.drawImage(images.oven, ovenX, beltY - h, ovenWidth, h);
    } else {
        ctx.fillStyle = '#b5651d';
        ctx.fillRect(ovenX, beltY - h, ovenWidth, h);
    }
}

function drawPlate() {
    const w = 140, h = 60;
    if (images.plate.complete) {
        ctx.drawImage(images.plate, plateX - w/2, plateY - h/2, w, h);
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ellipsePath(plateX, plateY + 6, 60, 18);
        ctx.fill();
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
    }
}

function drawSeal() {
    const x = plateX + 60;
    const y = plateY - 120;
    if (images.seal.complete) {
        ctx.drawImage(images.seal, x, y, 200, 150);
    } else {
        const baseX = plateX + 120;
        const baseY = plateY - 30;
        ctx.fillStyle = '#6a6a6a';
        ctx.beginPath();
        ellipsePath(baseX, baseY, 70, 50);
        ctx.fill();

        ctx.beginPath();
        ellipsePath(baseX + 50, baseY - 60, 30, 30);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(baseX + 40, baseY - 65, 4, 0, Math.PI * 2);
        ctx.arc(baseX + 60, baseY - 65, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(baseX + 50, baseY - 55, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    if (Date.now() <= captionEndTime) {
        ctx.font = '20px sans-serif';
        ctx.fillText('More pancakes!', x + 20, y - 10);
    }
}

function drawPancake(p) {
    const w = radius * 2;
    const h = thickness;
    if (images.pancake.complete) {
        ctx.filter = p.cooked ? 'none' : 'grayscale(100%)';
        ctx.drawImage(images.pancake, p.x - radius, p.y - h / 2, w, h);
        ctx.filter = 'none';
    } else {
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
        ellipsePath(p.x, p.y, radius, thickness / 2);
        ctx.fill();
    }
}

function updatePancakes() {
    if (leverPressFrames > 0) {
        leverPressFrames--;
    }
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
                captionEndTime = Date.now() + 5000;
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
    leverPressFrames = 10;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConveyor();
    drawMachine();
    drawOven();
    drawPlate();
    drawSeal();
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
