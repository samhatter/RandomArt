import RandomArt from './random-art.js';

// Function definitions
const funcs = [
  { prob: 0.25, arity: 1, func: (x) => x**2, string: (x) => `${x}**2` },
  { prob: 0.25, arity: 1, func: (x) => Math.abs(Math.cos(Math.PI*2*x)), string: (x) => `abs(cos(2pi${x}))` },
  { prob: 0.25, arity: 1, func: (x) => 1/(1+Math.exp(-x + 0.5)), string: (x) => `1/(1+exp(-${x}+0.5))` },
  { prob: 0.25, arity: 1, func: (x) => 10*x - Math.floor(10*x), string: (x) => `10${x} - floor(10${x})}` },
  { prob: 0.25, arity: 2, func: (x,y) => Math.sqrt(2)*Math.sqrt((x-0.5)**2+(y-0.5)**2), string: (x,y) => `sqrt(2)*sqrt((${x}-0.5)^2+(${y}-0.5)^2)` },
  { prob: 0.25, arity: 2, func: (x,y) => (x+y)/2, string: (x,y) => `(${x}+${y})/2` },
  { prob: 0.25, arity: 2, func: (x,y) => Math.abs(1-x-y), string: (x,y) => `abs(1-${x}-${y})` },
  { prob: 0.25, arity: 2, func: (x,y) => Math.max(x,y), string: (x,y) => `max(${x}, ${y})` },
];

// Get elements
const canvas = document.getElementById('art-canvas');
const depthInput = document.getElementById('depth');
const maxChildrenInput = document.getElementById('max-children');
const childProbInput = document.getElementById('child-prob');
const regenerateBtn = document.getElementById('regenerate');
const saveBtn = document.getElementById('save');

// Value displays
const depthValue = document.getElementById('depth-value');
const maxChildrenValue = document.getElementById('max-children-value');
const childProbValue = document.getElementById('child-prob-value');

let cleanup = null;

// Update value displays
depthInput.addEventListener('input', (e) => {
  depthValue.textContent = e.target.value;
});

maxChildrenInput.addEventListener('input', (e) => {
  maxChildrenValue.textContent = e.target.value;
});

childProbInput.addEventListener('input', (e) => {
  childProbValue.textContent = e.target.value;
});

// Generate art with current config
function generateArt() {
  if (cleanup) {
    cleanup();
  }

  const config = {
    funcs,
    depth: parseInt(depthInput.value),
    max_children: parseInt(maxChildrenInput.value),
    child_prob: parseFloat(childProbInput.value)
  };

  cleanup = RandomArt(canvas, config);
}

// Initialize
generateArt();

// Regenerate button
regenerateBtn.addEventListener('click', generateArt);

// Save button
saveBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `random-art-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
});