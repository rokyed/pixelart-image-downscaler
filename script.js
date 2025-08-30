const imageLoader = document.getElementById("imageLoader");
const sourceCanvas = document.getElementById("sourceCanvas");
const outputCanvas = document.getElementById("outputCanvas");
const gridWidthInput = document.getElementById("gridWidth");
const gridHeightInput = document.getElementById("gridHeight");
const offsetXInput = document.getElementById("offsetX");
const offsetYInput = document.getElementById("offsetY");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");

const sourceCtx = sourceCanvas.getContext("2d");
const outputCtx = outputCanvas.getContext("2d");
sourceCtx.imageSmoothingEnabled = false;
outputCtx.imageSmoothingEnabled = false;

let img = new Image();

imageLoader.addEventListener("change", handleImage);
[gridWidthInput, gridHeightInput, offsetXInput, offsetYInput].forEach(
  (input) => {
    input.addEventListener("input", () => {
      if (img.src) drawGrid();
    });
  },
);
generateBtn.addEventListener("click", generate);
downloadBtn.addEventListener("click", downloadOutput);

function handleImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    img.onload = function () {
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;
      sourceCtx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
      sourceCtx.drawImage(img, 0, 0);
      drawGrid();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function drawGrid() {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const gridW = parseInt(gridWidthInput.value, 10);
  const gridH = parseInt(gridHeightInput.value, 10);
  const offsetX = parseInt(offsetXInput.value, 10);
  const offsetY = parseInt(offsetYInput.value, 10);

  sourceCtx.clearRect(0, 0, width, height);
  sourceCtx.drawImage(img, 0, 0);

  sourceCtx.beginPath();
  for (let x = offsetX; x < width; x += gridW) {
    sourceCtx.moveTo(x, 0);
    sourceCtx.lineTo(x, height);
  }
  for (let y = offsetY; y < height; y += gridH) {
    sourceCtx.moveTo(0, y);
    sourceCtx.lineTo(width, y);
  }
  sourceCtx.strokeStyle = "rgba(255,0,0,0.5)";
  sourceCtx.stroke();
}

function getAverageColor(imageData) {
  const data = imageData.data;
  let r = 0,
    g = 0,
    b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const count = data.length / 4;
  return `rgb(${(r / count) | 0}, ${(g / count) | 0}, ${(b / count) | 0})`;
}

function generate() {
  if (!img.src) return;
  drawGrid();

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const gridW = parseInt(gridWidthInput.value, 10);
  const gridH = parseInt(gridHeightInput.value, 10);
  const offsetX = parseInt(offsetXInput.value, 10);
  const offsetY = parseInt(offsetYInput.value, 10);

  const cols = Math.floor((width - offsetX) / gridW);
  const rows = Math.floor((height - offsetY) / gridH);
  outputCanvas.width = cols;
  outputCanvas.height = rows;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const sx = offsetX + x * gridW;
      const sy = offsetY + y * gridH;
      const data = sourceCtx.getImageData(sx, sy, gridW, gridH);
      outputCtx.fillStyle = getAverageColor(data);
      outputCtx.fillRect(x, y, 1, 1);
    }
  }
}

function downloadOutput() {
  const link = document.createElement("a");
  link.download = "output.png";
  link.href = outputCanvas.toDataURL();
  link.click();
}
