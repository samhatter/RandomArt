import RandomArt from './random-art.js';

// Default configuration
const defaultConfig = `{
  funcs: [
    { prob: 0.25, arity: 1, func: (x) => x**2, string: (x) => \`\${x}**2\` },
    { prob: 0.25, arity: 1, func: (x) => Math.abs(Math.cos(Math.PI*2*x)), string: (x) => \`abs(cos(2pi\${x}))\` },
    { prob: 0.25, arity: 1, func: (x) => 1/(1+Math.exp(-x + 0.5)), string: (x) => \`1/(1+exp(-\${x}+0.5))\` },
    { prob: 0.25, arity: 1, func: (x) => 10*x - Math.floor(10*x), string: (x) => \`10\${x} - floor(10\${x})}\` },
    { prob: 0.25, arity: 2, func: (x,y) => Math.sqrt(2)*Math.sqrt((x-0.5)**2+(y-0.5)**2), string: (x,y) => \`sqrt(2)*sqrt((\${x}-0.5)^2+(\${y}-0.5)^2)\` },
    { prob: 0.25, arity: 2, func: (x,y) => (x+y)/2, string: (x,y) => \`(\${x}+\${y})/2\` },
    { prob: 0.25, arity: 2, func: (x,y) => Math.abs(1-x-y), string: (x,y) => \`abs(1-\${x}-\${y})\` },
    { prob: 0.25, arity: 2, func: (x,y) => Math.max(x,y), string: (x,y) => \`max(\${x}, \${y})\` },
  ],
  depth: 3,
  max_children: 2,
  child_prob: 0.5
}`;

// Get elements
const canvas = document.getElementById('art-canvas');
const configTextarea = document.getElementById('config');
const regenerateBtn = document.getElementById('regenerate');
const saveBtn = document.getElementById('save');
const expressionDiv = document.getElementById('expression');

let cleanup = null;

// Initialize textarea with default config
configTextarea.value = defaultConfig;

// Generate art with current config
function generateArt() {
  if (cleanup) {
    cleanup();
  }

  try {
    // Evaluate the config from the textarea
    const config = eval(`(${configTextarea.value})`);
    const result = RandomArt(canvas, config);
    cleanup = result.cleanup;
    
    // Display the expression
    if (result.expression) {
      expressionDiv.textContent = result.expression;
    }
  } catch (error) {
    console.error('Error parsing configuration:', error);
    alert('Error in configuration: ' + error.message);
  }
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