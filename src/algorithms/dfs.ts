import { Node } from '../core/Node';

/**
 * Result of DFS traversal
 */
export interface DFSResult<T> {
  /** Array of all visited nodes in DFS order */
  visited: Node<T>[];
  /** The first node matching the predicate (if predicate was provided), undefined otherwise */
  found?: Node<T>;
}

/**
 * Depth-First Search (DFS) traversal
 * Uses iterative stack-based implementation to avoid stack overflow on deep graphs
 * @param startLeaf - The leaf to start traversal from
 * @param visitOrOptions - Optional callback function (legacy API) or options object
 * @param visitOrOptions.visit - Optional callback function called for each visited leaf
 * @param visitOrOptions.predicate - Optional predicate function. If provided, stops searching once a match is found (early termination)
 * @returns Object with `visited` array and optional `found` node
 *
 * @example
 * ```typescript
 * // Full traversal
 * const result = DFS(startLeaf);
 * // result.visited contains all nodes, result.found is undefined
 *
 * // Legacy API: visit callback
 * const result = DFS(startLeaf, (leaf) => console.log(leaf));
 * // result.visited contains all nodes, result.found is undefined
 *
 * // New API: options object
 * const result = DFS(startLeaf, { visit: (leaf) => console.log(leaf) });
 * // result.visited contains all nodes, result.found is undefined
 *
 * // Search with early termination
 * const result = DFS(startLeaf, { predicate: (leaf) => leaf.value.name === 'Bob' });
 * // result.visited contains nodes visited before match, result.found is the matching node or undefined
 * ```
 */
export function DFS<T>(
  startLeaf: Node<T>,
  visitOrOptions?:
    | ((leaf: Node<T>) => void)
    | { visit?: (leaf: Node<T>) => void }
    | { predicate?: (leaf: Node<T>) => boolean }
): DFSResult<T> {
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
  const stack: Node<T>[] = [startLeaf];
  const visited: Node<T>[] = [];
  let found: Node<T> | undefined;

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visitedSet.has(current)) {
      continue;
    }

    visitedSet.add(current);

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

    // Push connected leaves in reverse order to maintain left-to-right traversal
    for (let i = current.branches.length - 1; i >= 0; i--) {
      const nextLeaf = current.branches[i].to;
      if (!visitedSet.has(nextLeaf)) {
        stack.push(nextLeaf);
      }
    }
  }

  return { visited, found };
}
