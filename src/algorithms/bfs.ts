import { Node } from '../core/Node';

/**
 * Result of BFS traversal
 */
export interface BFSResult<T> {
  /** Array of all visited nodes in BFS order */
  visited: Node<T>[];
  /** The first node matching the predicate (if predicate was provided), undefined otherwise */
  found?: Node<T>;
}

/**
 * Breadth-First Search (BFS) traversal
 * Uses iterative queue-based implementation for large graphs
 * Optimized with index-based queue to avoid O(n) shift() operations
 * @param startLeaf - The leaf to start traversal from
 * @param visitOrOptions - Optional callback function (legacy API) or options object
 * @param visitOrOptions.visit - Optional callback function called for each visited leaf
 * @param visitOrOptions.predicate - Optional predicate function. If provided, stops searching once a match is found (early termination)
 * @returns Object with `visited` array and optional `found` node
 *
 * @example
 * ```typescript
 * // Full traversal
 * const result = BFS(startLeaf);
 * // result.visited contains all nodes, result.found is undefined
 *
 * // Legacy API: visit callback
 * const result = BFS(startLeaf, (leaf) => console.log(leaf));
 * // result.visited contains all nodes, result.found is undefined
 *
 * // New API: options object
 * const result = BFS(startLeaf, { visit: (leaf) => console.log(leaf) });
 * // result.visited contains all nodes, result.found is undefined
 *
 * // Search with early termination
 * const result = BFS(startLeaf, { predicate: (leaf) => leaf.value.name === 'Bob' });
 * // result.visited contains nodes visited before match, result.found is the matching node or undefined
 * ```
 */
export function BFS<T>(
  startLeaf: Node<T>,
  visitOrOptions?:
    | ((leaf: Node<T>) => void)
    | { visit?: (leaf: Node<T>) => void }
    | { predicate?: (leaf: Node<T>) => boolean }
): BFSResult<T> {
  // Handle legacy API: if second param is a function, treat it as visit callback
  let visit: ((leaf: Node<T>) => void) | undefined;
  let predicate: ((leaf: Node<T>) => boolean) | undefined;

  if (typeof visitOrOptions === 'function') {
    visit = visitOrOptions;
  } else if (visitOrOptions) {
    visit = 'visit' in visitOrOptions ? visitOrOptions.visit : undefined;
    predicate = 'predicate' in visitOrOptions ? visitOrOptions.predicate : undefined;
  }

  const visitedSet: Set<Node<T>> = new Set();
  const queue: Node<T>[] = [startLeaf];
  const visited: Node<T>[] = [];
  let queueIndex = 0;
  let found: Node<T> | undefined;

  visitedSet.add(startLeaf);

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];

    // Call visit callback if provided
    if (visit) {
      visit(current);
    }

    // Add to visited array
    visited.push(current);

    // If predicate is provided, check for match
    if (predicate && !found) {
      if (predicate(current)) {
        found = current;
        // Continue to collect all visited nodes even after match
      }
    }

    // Visit all connected leaves (outgoing branches)
    for (const branch of current.branches) {
      const nextLeaf = branch.to;
      if (!visitedSet.has(nextLeaf)) {
        visitedSet.add(nextLeaf);
        queue.push(nextLeaf);
      }
    }
  }

  return { visited, found };
}
