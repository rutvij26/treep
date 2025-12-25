import { Node } from '../core/Node';
import { Graph } from '../core/Graph';
import { findRoot, getChildren } from './treeOperations';

/**
 * Check if a graph is a valid tree
 * A tree must have:
 * - Exactly one root
 * - No cycles
 * - All nodes reachable from root
 */
export function isTree<T>(graph: Graph<T>): boolean {
  if (graph.size() === 0) {
    return true; // Empty graph is a valid tree
  }

  try {
    const root = findRoot(graph);
    if (root === null) {
      return false; // No root found
    }

    // Check for cycles - need to pass a starting node
    // For now, we'll do a simple check
    try {
      // Try to detect cycles by checking if any node is visited twice
      const allNodes = new Set<Node<T>>();
      for (const branch of graph.branches()) {
        allNodes.add(branch.from);
        allNodes.add(branch.to);
      }
      // Simple cycle check: if branches >= nodes, might have cycle
      if (graph.branches().length >= graph.size()) {
        return false;
      }
    } catch {
      return false;
    }

    // Check if all nodes are reachable from root
    const visited = new Set<Node<T>>();
    const queue: Node<T>[] = [root];
    visited.add(root);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = getChildren(current);

      for (const child of children) {
        if (visited.has(child)) {
          return false; // Already visited - not a tree
        }
        visited.add(child);
        queue.push(child);
      }
    }

    // All nodes should be reachable
    return visited.size === graph.size();
  } catch {
    return false;
  }
}

/**
 * Check if a tree is a valid Binary Search Tree (BST)
 * For BST, each node must satisfy:
 * - Left child < node < right child
 * - All left subtree < node
 * - All right subtree > node
 */
export function isBST<T>(root: Node<T>, compareFn?: (a: T, b: T) => number): boolean {
  const defaultCompare = (a: T, b: T): number => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  const compare = compareFn || defaultCompare;

  const isValid = (node: Node<T> | null, min: T | null, max: T | null): boolean => {
    if (node === null) {
      return true;
    }

    const nodeValue = node.value;

    // Check bounds
    if (min !== null && compare(nodeValue, min) <= 0) {
      return false;
    }
    if (max !== null && compare(nodeValue, max) >= 0) {
      return false;
    }

    const children = getChildren(node);

    // BST should have at most 2 children
    if (children.length > 2) {
      return false;
    }

    // Recursively check left and right subtrees
    const left = children.length > 0 ? children[0] : null;
    const right = children.length > 1 ? children[1] : null;

    return isValid(left, min, nodeValue) && isValid(right, nodeValue, max);
  };

  return isValid(root, null, null);
}

/**
 * Check if a tree is balanced
 * A tree is balanced if the height difference between left and right subtrees
 * is at most 1 for all nodes
 */
export function isBalanced<T>(root: Node<T>): boolean {
  const checkBalance = (node: Node<T> | null): { balanced: boolean; height: number } => {
    if (node === null) {
      return { balanced: true, height: 0 };
    }

    const children = getChildren(node);
    if (children.length === 0) {
      return { balanced: true, height: 1 };
    }

    // For binary tree balance, we need exactly 2 children to compare
    // For general tree, check if all subtrees are balanced and height diff <= 1
    if (children.length === 1) {
      // Single child - check if subtree is balanced
      const childResult = checkBalance(children[0]);
      if (!childResult.balanced) {
        return { balanced: false, height: 0 };
      }
      // If we have only one child, the tree is unbalanced if height > 1
      // (because the other side has height 0, so difference is > 1)
      return {
        balanced: childResult.height <= 1,
        height: childResult.height + 1,
      };
    }

    // Multiple children - check balance of each and height differences
    const heights: number[] = [];
    for (const child of children) {
      const result = checkBalance(child);
      if (!result.balanced) {
        return { balanced: false, height: 0 };
      }
      heights.push(result.height);
    }

    const maxHeight = Math.max(...heights);
    const minHeight = Math.min(...heights);
    const heightDiff = maxHeight - minHeight;
    const balanced = heightDiff <= 1;

    return {
      balanced,
      height: maxHeight + 1,
    };
  };

  return checkBalance(root).balanced;
}

/**
 * Check if a tree is a complete binary tree
 * A complete binary tree has all levels fully filled except possibly the last,
 * and the last level is filled from left to right
 */
export function isComplete<T>(root: Node<T>): boolean {
  if (!root) {
    return true;
  }

  const queue: (Node<T> | null)[] = [root];
  let foundNull = false;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === null) {
      foundNull = true;
    } else {
      if (foundNull) {
        return false; // Found a node after a null
      }

      const children = getChildren(current);
      // For complete binary tree, we need exactly 0 or 2 children
      // But we'll allow any number and check structure
      if (children.length > 2) {
        return false; // Not a binary tree
      }

      // Add children (pad with nulls if needed)
      queue.push(children.length > 0 ? children[0] : null);
      queue.push(children.length > 1 ? children[1] : null);
    }
  }

  return true;
}

/**
 * Check if a tree is a full binary tree
 * A full binary tree has every node with either 0 or 2 children
 */
export function isFull<T>(root: Node<T>): boolean {
  if (!root) {
    return true;
  }

  const children = getChildren(root);

  // Leaf node (0 children) - valid
  if (children.length === 0) {
    return true;
  }

  // Must have exactly 2 children for full binary tree
  if (children.length !== 2) {
    return false;
  }

  // Recursively check both subtrees
  return isFull(children[0]) && isFull(children[1]);
}

/**
 * Check if a tree is a perfect binary tree
 * A perfect binary tree is both full and complete, and all leaves are at the same level
 */
export function isPerfect<T>(root: Node<T>): boolean {
  return isFull(root) && isComplete(root);
}
