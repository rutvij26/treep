import { Node } from '../core/Node';

/**
 * Breadth-First Search (BFS) traversal
 * Uses iterative queue-based implementation for large graphs
 * Optimized with index-based queue to avoid O(n) shift() operations
 * @param startLeaf - The leaf to start traversal from
 * @param visit - Optional callback function called for each visited leaf
 * @returns Array of leaves visited in BFS order
 */
export function BFS<T>(startLeaf: Node<T>, visit?: (leaf: Node<T>) => void): Node<T>[] {
  const visited: Set<Node<T>> = new Set();
  const queue: Node<T>[] = [startLeaf];
  const result: Node<T>[] = [];
  let queueIndex = 0;

  visited.add(startLeaf);

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];

    if (visit) {
      visit(current);
    }
    result.push(current);

    // Visit all connected leaves (outgoing branches)
    for (const branch of current.branches) {
      const nextLeaf = branch.to;
      if (!visited.has(nextLeaf)) {
        visited.add(nextLeaf);
        queue.push(nextLeaf);
      }
    }
  }

  return result;
}
