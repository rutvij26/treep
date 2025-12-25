import { Node } from '../core/Node';

/**
 * Depth-First Search (DFS) traversal
 * Uses iterative stack-based implementation to avoid stack overflow on deep graphs
 * @param startLeaf - The leaf to start traversal from
 * @param visit - Optional callback function called for each visited leaf
 * @returns Array of leaves visited in DFS order
 */
export function DFS<T>(startLeaf: Node<T>, visit?: (leaf: Node<T>) => void): Node<T>[] {
  const visited: Set<Node<T>> = new Set();
  const stack: Node<T>[] = [startLeaf];
  const result: Node<T>[] = [];

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    if (visit) {
      visit(current);
    }
    result.push(current);

    // Push connected leaves in reverse order to maintain left-to-right traversal
    for (let i = current.branches.length - 1; i >= 0; i--) {
      const nextLeaf = current.branches[i].to;
      if (!visited.has(nextLeaf)) {
        stack.push(nextLeaf);
      }
    }
  }

  return result;
}
