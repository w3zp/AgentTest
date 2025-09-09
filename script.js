const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const gravity = 0.05;
const fireworks = [];
const particles = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor() {
    this.x = random(canvas.width * 0.2, canvas.width * 0.8);
    this.y = canvas.height;
    this.targetY = random(canvas.height * 0.2, canvas.height * 0.5);
    this.speed = random(3, 5);
    this.color = `hsl(${Math.floor(random(0, 360))}, 100%, 50%)`;
    this.exploded = false;
  }
  update(index) {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        for (let i = 0; i < 50; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
        fireworks.splice(index, 1);
      }
    }
    this.draw();
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = random(0, Math.PI * 2);
    const speed = random(1, 6);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
  }
  update(index) {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;
    if (this.alpha <= 0) {
      particles.splice(index, 1);
      return;
    }
    this.draw();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function launch() {
  fireworks.push(new Firework());
}
setInterval(launch, 500);

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update(i);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(i);
  }
}
animate();
