import { Node } from '../core/Node';

/**
 * Tree traversal order types
 */
export type TraversalOrder = 'pre-order' | 'in-order' | 'post-order' | 'level-order';

/**
 * Pre-order traversal: Root → Left → Right
 * Visits the root before its children
 */
export function preOrder<T>(root: Node<T>, visit: (leaf: Node<T>) => void): Node<T>[] {
  const visited: Node<T>[] = [];
  const stack: Node<T>[] = [root];

  while (stack.length > 0) {
    const current = stack.pop()!;
    visit(current);
    visited.push(current);

    // Push children in reverse order to maintain left-to-right traversal
    const children = current.getConnectedLeaves();
    for (let i = children.length - 1; i >= 0; i--) {
      stack.push(children[i]);
    }
  }

  return visited;
}

/**
 * In-order traversal: Left → Root → Right
 * For binary trees, visits nodes in sorted order
 */
export function inOrder<T>(root: Node<T>, visit: (leaf: Node<T>) => void): Node<T>[] {
  const visited: Node<T>[] = [];
  const stack: Node<T>[] = [];
  let current: Node<T> | null = root;

  while (stack.length > 0 || current !== null) {
    // Go to the leftmost node
    while (current !== null) {
      stack.push(current);
      const children = current.getConnectedLeaves();
      current = children.length > 0 ? children[0] : null;
    }

    // Visit the current node
    current = stack.pop()!;
    visit(current);
    visited.push(current);

    // Move to right child (or next child if not binary)
    const children = current.getConnectedLeaves();
    current = children.length > 1 ? children[1] : null;
  }

  return visited;
}

/**
 * Post-order traversal: Left → Right → Root
 * Visits children before the root
 */
export function postOrder<T>(root: Node<T>, visit: (leaf: Node<T>) => void): Node<T>[] {
  const visited: Node<T>[] = [];
  const stack: Node<T>[] = [root];
  const processed = new Set<Node<T>>();

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const children = current.getConnectedLeaves();

    // If all children have been processed, visit this node
    const unprocessedChildren = children.filter(child => !processed.has(child));

    if (unprocessedChildren.length === 0) {
      stack.pop();
      visit(current);
      visited.push(current);
      processed.add(current);
    } else {
      // Push unprocessed children in reverse order
      for (let i = unprocessedChildren.length - 1; i >= 0; i--) {
        stack.push(unprocessedChildren[i]);
      }
    }
  }

  return visited;
}

/**
 * Level-order traversal (BFS): Visits nodes level by level
 * Same as BFS but specifically for tree structures
 */
export function levelOrder<T>(root: Node<T>, visit: (leaf: Node<T>) => void): Node<T>[] {
  const visited: Node<T>[] = [];
  const queue: Node<T>[] = [root];
  const seen = new Set<Node<T>>();
  seen.add(root);

  while (queue.length > 0) {
    const current = queue.shift()!;
    visit(current);
    visited.push(current);

    const children = current.getConnectedLeaves();
    for (const child of children) {
      if (!seen.has(child)) {
        seen.add(child);
        queue.push(child);
      }
    }
  }

  return visited;
}

/**
 * Generic tree traversal function that supports all traversal orders
 */
export function treeTraversal<T>(
  root: Node<T>,
  order: TraversalOrder = 'pre-order',
  visit?: (leaf: Node<T>) => void
): Node<T>[] {
  const visitFn =
    visit ||
    (() => {
      // Default: do nothing
    });

  switch (order) {
    case 'pre-order':
      return preOrder(root, visitFn);
    case 'in-order':
      return inOrder(root, visitFn);
    case 'post-order':
      return postOrder(root, visitFn);
    case 'level-order':
      return levelOrder(root, visitFn);
    default: {
      // This should never happen due to TypeScript type checking
      const _exhaustive: never = order;
      throw new Error(`Unknown traversal order: ${String(_exhaustive)}`);
    }
  }
}
