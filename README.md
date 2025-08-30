
# 🎨 Pixel Art Grid-Based Downscaler (Pure HTML + JS)

## 🎯 Objective

Create a **static web app** that:

1. Loads a pixel art image into a `<canvas>`.
2. Overlays a **configurable grid**.
3. Lets the user **adjust grid size and offset** to match the image.
4. Computes the **average color** of each grid cell.
5. Renders a **scaled-down preview canvas** (1 pixel per grid square).

---

## 🗂️ File Structure

```
pixel-grid-downscaler/
├── index.html
├── style.css
└── script.js
```

---

## 📋 HTML (`index.html`)

- Two canvas elements:
  - `#sourceCanvas`: image + grid
  - `#outputCanvas`: scaled-down image (1px per cell)
- UI controls:
  - Image upload
  - Grid width / height (in px)
  - Offset X / Y
  - Generate button
  - (Optional) Download button

---

## 🎛️ Features

### Upload Image
- Use `<input type="file">` to load an image into a canvas.

### Grid Calibration
- Inputs for:
  - Grid Width: `gridWidth` (e.g. 16)
  - Grid Height: `gridHeight` (e.g. 16)
  - Offset X and Y to align the grid
- Grid drawn using `ctx.strokeRect()` on top of the image.

### Color Averaging
- For each grid square:
  - Use `getImageData(x, y, gridWidth, gridHeight)`
  - Compute average RGB
  - Plot it as a 1px block on the output canvas.

### Output
- Output canvas size is `cols x rows`
- Each cell is drawn with the average color of that grid cell

---

## 🧠 JS Pseudocode (`script.js`)

```js
function drawGrid(ctx, width, height, gridW, gridH, offsetX, offsetY) {
  ctx.beginPath();
  for (let x = offsetX; x < width; x += gridW) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = offsetY; y < height; y += gridH) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.strokeStyle = 'rgba(255,0,0,0.5)';
  ctx.stroke();
}

function getAverageColor(imageData) {
  const data = imageData.data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const count = data.length / 4;
  return `rgb(${r/count|0}, ${g/count|0}, ${b/count|0})`;
}

function generateOutputCanvas(sourceCtx, outputCtx, width, height, gridW, gridH, offsetX, offsetY) {
  const cols = Math.floor((width - offsetX) / gridW);
  const rows = Math.floor((height - offsetY) / gridH);
  outputCtx.canvas.width = cols;
  outputCtx.canvas.height = rows;

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
````

---

## 🎨 UI Controls (HTML Examples)

```html
<input type="file" id="imageLoader">
<label>Grid W: <input type="number" id="gridWidth" value="16"></label>
<label>Grid H: <input type="number" id="gridHeight" value="16"></label>
<label>Offset X: <input type="number" id="offsetX" value="0"></label>
<label>Offset Y: <input type="number" id="offsetY" value="0"></label>
<button onclick="generate()">Generate Preview</button>
```

---

## 🧪 Tips

* Always set `ctx.imageSmoothingEnabled = false` for pixel-perfect visuals.
* Draw the grid **after** the image is rendered.
* Use `requestAnimationFrame()` if interactive calibration is needed.

---

## ✅ Optional Features

* Add a "Download PNG" button for output canvas
* Zoom the preview canvas for easier viewing
* Display HEX/RGB values under mouse hover

---

## 🔚 Summary

This tool lets you **analyze and downscale pixel art** based on a **custom grid**, providing an averaged, color-mapped small image. All done in the browser — no backend or build tools needed.


