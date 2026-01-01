/**
 * @typedef {[number, number, number]} Color - RGB color tuple
 */

/**
 * @typedef {Object} FuncDefinition
 * @property {number} arity - Number of arguments the function takes
 * @property {Function} func - The evaluation function
 * @property {Function} string - The string representation function
 * @property {number} prob - Probability weight for selection
 */

/**
 * @typedef {Object} TreeNode
 * @property {Function} func - Evaluation function for this node
 * @property {Function} string - String representation function
 * @property {TreeNode[]} children - Child nodes
 */

/**
 * @typedef {Object} RandomArtConfig
 * @property {FuncDefinition[]} funcs - Array of function definitions with arity property
 * @property {number} depth - Maximum tree depth
 * @property {number} max_children - Maximum number of children per node
 * @property {number} child_prob - Probability of adding additional children
 */

/**
 * Creates a tree node
 * @param {Function} func - Evaluation function
 * @param {Function} string - String representation function
 * @param {TreeNode[]} children - Child nodes
 * @returns {TreeNode}
 */
export const createTreeNode = (func, string, children = []) => ({
  func,
  string,
  children
});
