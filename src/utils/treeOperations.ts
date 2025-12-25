import { Node } from '../core/Node';
import { Graph } from '../core/Graph';
import { TreeError } from '../errors/TreeError';

/**
 * Find the root of a tree (node with no incoming edges)
 * In a tree, there should be exactly one root
 */
export function findRoot<T>(graph: Graph<T>): Node<T> | null {
  const leaves = graph.leaves();
  if (leaves.length === 0) {
    return null;
  }

  // Find nodes with no incoming branches
  const hasIncoming = new Set<Node<T>>();
  for (const branch of graph.branches()) {
    hasIncoming.add(branch.to);
  }

  const roots: Node<T>[] = [];
  for (const leaf of leaves) {
    if (!hasIncoming.has(leaf)) {
      roots.push(leaf);
    }
  }

  if (roots.length === 0) {
    // All nodes have incoming edges - might be a cycle or disconnected
    // Return the first node as a fallback
    return leaves[0];
  }

  if (roots.length > 1) {
    throw new TreeError(
      `Multiple roots found in tree (${roots.length}). Tree should have exactly one root.`,
      'MULTIPLE_ROOTS'
    );
  }

  return roots[0];
}

/**
 * Check if a node is a root (has no incoming edges)
 */
export function isRoot<T>(node: Node<T>, graph: Graph<T>): boolean {
  const branches = graph.branches();
  for (const branch of branches) {
    if (branch.to === node) {
      return false;
    }
  }
  return true;
}

/**
 * Get the root of a tree from a given node
 * Traverses up the tree to find the root
 */
export function getRoot<T>(node: Node<T>, graph: Graph<T>): Node<T> | null {
  const visited = new Set<Node<T>>();
  let current: Node<T> | null = node;

  while (current !== null) {
    if (visited.has(current)) {
      // Cycle detected
      throw new TreeError('Cycle detected while finding root', 'CYCLE_DETECTED');
    }
    visited.add(current);

    // Find parent (node that has a branch to current)
    let parent: Node<T> | null = null;
    for (const branch of graph.branches()) {
      if (branch.to === current) {
        parent = branch.from;
        break;
      }
    }

    if (parent === null) {
      // No parent found - this is the root
      return current;
    }

    current = parent;
  }

  return current;
}

/**
 * Get parent of a node
 */
export function getParent<T>(node: Node<T>, graph: Graph<T>): Node<T> | null {
  for (const branch of graph.branches()) {
    if (branch.to === node) {
      return branch.from;
    }
  }
  return null;
}

/**
 * Get children of a node
 */
export function getChildren<T>(node: Node<T>): Node<T>[] {
  return node.getConnectedLeaves();
}

/**
 * Get siblings of a node (nodes with the same parent)
 */
export function getSiblings<T>(node: Node<T>, graph: Graph<T>): Node<T>[] {
  const parent = getParent(node, graph);
  if (parent === null) {
    // Root node has no siblings
    return [];
  }

  const siblings: Node<T>[] = [];
  const children = getChildren(parent);
  for (const child of children) {
    if (child !== node) {
      siblings.push(child);
    }
  }

  return siblings;
}

/**
 * Get ancestors of a node (all nodes on path to root)
 */
export function getAncestors<T>(node: Node<T>, graph: Graph<T>): Node<T>[] {
  const ancestors: Node<T>[] = [];
  const visited = new Set<Node<T>>();
  let current: Node<T> | null = node;

  while (current !== null) {
    if (visited.has(current)) {
      throw new TreeError('Cycle detected while finding ancestors', 'CYCLE_DETECTED');
    }
    visited.add(current);

    const parent: Node<T> | null = getParent(current, graph);
    if (parent === null) {
      break;
    }

    ancestors.push(parent);
    current = parent;
  }

  return ancestors;
}

/**
 * Get descendants of a node (all nodes in subtree)
 */
export function getDescendants<T>(node: Node<T>): Node<T>[] {
  const descendants: Node<T>[] = [];
  const visited = new Set<Node<T>>();
  const stack: Node<T>[] = [node];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    const children = getChildren(current);
    for (const child of children) {
      if (child !== node) {
        descendants.push(child);
        stack.push(child);
      }
    }
  }

  return descendants;
}

/**
 * Calculate the height of a tree (longest path from root to leaf)
 */
export function getHeight<T>(root: Node<T>): number {
  const children = getChildren(root);
  if (children.length === 0) {
    return 0;
  }

  let maxHeight = 0;
  for (const child of children) {
    const childHeight = getHeight(child);
    maxHeight = Math.max(maxHeight, childHeight);
  }

  return maxHeight + 1;
}

/**
 * Calculate the depth of a node (distance from root)
 */
export function getDepth<T>(node: Node<T>, graph: Graph<T>): number {
  const ancestors = getAncestors(node, graph);
  return ancestors.length;
}

/**
 * Calculate the size of a tree (number of nodes in subtree)
 */
export function getTreeSize<T>(root: Node<T>): number {
  const visited = new Set<Node<T>>();
  const stack: Node<T>[] = [root];
  let size = 0;

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);
    size++;

    const children = getChildren(current);
    for (const child of children) {
      stack.push(child);
    }
  }

  return size;
}

/**
 * Calculate the width of a tree (maximum number of nodes at any level)
 */
export function getWidth<T>(root: Node<T>): number {
  if (!root) {
    return 0;
  }

  let maxWidth = 0;
  const queue: Node<T>[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    maxWidth = Math.max(maxWidth, levelSize);

    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift()!;
      const children = getChildren(current);
      for (const child of children) {
        queue.push(child);
      }
    }
  }

  return maxWidth;
}
