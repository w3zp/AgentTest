const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const dims = document.getElementById('dims');

let isDrawing = false;
let startX = 0;
let startY = 0;

function drawPreview(x, y, square) {
  const width = x - startX;
  const height = y - startY;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(savedImage, 0, 0);
  let w = width;
  let h = height;
  if (square) {
    const size = Math.min(Math.abs(width), Math.abs(height));
    w = width < 0 ? -size : size;
    h = height < 0 ? -size : size;
  }
  ctx.strokeRect(startX, startY, w, h);
  dims.style.left = (startX + w + 5) + 'px';
  dims.style.top = (startY + h + 5) + 'px';
  dims.textContent = `${Math.abs(w)} x ${Math.abs(h)}`;
  dims.style.display = 'block';
}

let savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', (e) => {
  startX = e.offsetX;
  startY = e.offsetY;
  savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  drawPreview(e.offsetX, e.offsetY, e.shiftKey);
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;
  drawPreview(e.offsetX, e.offsetY, e.shiftKey);
  isDrawing = false;
  dims.style.display = 'none';
  savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mouseleave', () => {
  if (isDrawing) {
    ctx.putImageData(savedImage, 0, 0);
    isDrawing = false;
    dims.style.display = 'none';
  }
});
