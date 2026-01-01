import { createTreeNode } from './types.js';

/**
 * @typedef {import('./types.js').Color} Color
 * @typedef {import('./types.js').TreeNode} TreeNode
 * @typedef {import('./types.js').RandomArtConfig} RandomArtConfig
 */

/**
 * @param {HTMLCanvasElement} canvasElement
 * @param {RandomArtConfig} config
 */
const RandomArt = (canvasElement, config) => {
  /**
   * Maps a value to a color between two colors
   * @param {number} value - Value between 0 and 1
   * @param {Color} startColor - Starting RGB color
   * @param {Color} endColor - Ending RGB color
   * @returns {Color}
   */
  const valueToColor = (value, startColor, endColor) => {
    value = Math.max(0, Math.min(value, 1));
    
    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * value);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * value);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * value);

    return [r, g, b];
  };

  /**
   * Generates a random expression tree
   * @param {RandomArtConfig} config
   * @returns {TreeNode}
   */
  const randomEvalFunc = (config) => {
    /**
     * Choose a random function based on probability weights
     * @param {number} num_args - Number of arguments required
     * @returns {{func: Function, string: Function}}
     */
    const chooseFunc = (num_args) => {
      const funcsForArity = config.funcs.filter(f => f.arity === num_args);
      

      const totalProb = funcsForArity.reduce((sum, f) => sum + f.prob, 0);
      const rand = Math.random() * totalProb;
      
      for (let i = 0, acc = 0; i < funcsForArity.length; i++) {
        acc += funcsForArity[i].prob;
        if (rand <= acc) {
          return {
            func: funcsForArity[i].func,
            string: funcsForArity[i].string
          };
        }
      }
      
      // Fallback (should never reach here due to normalization)
      return {
        func: funcsForArity[0].func,
        string: funcsForArity[0].string
      };
    };

    /**
     * Recursively builds expression tree
     * @param {number} currentDepth
     * @returns {TreeNode}
     */
    const buildTree = (currentDepth) => {
      if (currentDepth === 0) {
        const nodeFunc = chooseFunc(2);
        return createTreeNode(nodeFunc.func, nodeFunc.string, []);
      }

      const children = [];
      children.push(buildTree(currentDepth - 1));

      for (let i = 0; i < config.max_children - 1; i++) {
        if (Math.random() <= config.child_prob) {
          children.push(buildTree(currentDepth - 1));
        }
      }

      const nodeFunc = chooseFunc(children.length);
      return createTreeNode(nodeFunc.func, nodeFunc.string, children);
    };

    return buildTree(config.depth);
  };

  /**
   * Evaluates the tree at a given point
   * @param {number} x - X coordinate (0-1)
   * @param {number} y - Y coordinate (0-1)
   * @param {TreeNode} node - Tree node to evaluate
   * @returns {number}
   */
  const evalTree = (x, y, node) => {
    if (node.children.length === 0) {
      return node.func(x, y);
    }
    
    const childResults = node.children.map(child => evalTree(x, y, child));
    return node.func(...childResults);
  };

  /**
   * Generates string representation of the tree
   * @param {TreeNode} node
   * @returns {string}
   */
  const printTree = (node) => {
    if (node.children.length === 0) {
      return node.string("x", "y");
    }
    
    const childResults = node.children.map(child => printTree(child));
    return node.string(...childResults);
  };
  
  /**
   * Generates art on the canvas
   * @param {RandomArtConfig} config
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} clientWidth
   * @param {number} clientHeight
   * @param {number} scaleFactor
   */
  const generateArt = (config, ctx, clientWidth, clientHeight, scaleFactor) => {
    const imageData = ctx.createImageData(clientWidth * scaleFactor, clientHeight * scaleFactor);
    const data = imageData.data;
    const tree = randomEvalFunc(config);
    const expression = printTree(tree);
    console.log(expression);
    
    for (let y = 0; y < clientHeight * scaleFactor; y++) {
      for (let x = 0; x < clientWidth * scaleFactor; x++) {
        const value = evalTree(
          x / (scaleFactor * clientWidth),
          y / (scaleFactor * clientHeight),
          tree
        );
        const color = valueToColor(value, [0, 0, 0], [255, 255, 255]);
        const index = (y * clientWidth * scaleFactor + x) * 4;
        data[index] = color[0];     // R
        data[index + 1] = color[1]; // G
        data[index + 2] = color[2]; // B
        data[index + 3] = 255;      // A
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    return expression;
  };

  /**
   * Draws art on the canvas
   * @param {HTMLCanvasElement} canvas
   * @param {RandomArtConfig} config
   */
  const drawArt = (canvas, config) => {
    const ctx = canvas.getContext('2d');
    const scaleFactor = window.devicePixelRatio || 1;
    
    if (!ctx) {
      return null;
    }
    
    canvas.width = canvas.offsetWidth * scaleFactor;
    canvas.height = canvas.offsetHeight * scaleFactor;
    ctx.scale(scaleFactor, scaleFactor);
    const { clientWidth, clientHeight } = canvas;
    return generateArt(config, ctx, clientWidth, clientHeight, scaleFactor);
  };

  if (!canvasElement) {
    console.error('Canvas element not found');
    return { cleanup: () => {}, expression: null };
  }

  const expression = drawArt(canvasElement, config);
  return { cleanup: () => {}, expression };
};

export default RandomArt;
