import { Node } from '../core/Node';
import { Graph } from '../core/Graph';
import type { PathConstraints } from './pathFinding';

/**
 * Lazy BFS traversal using generator
 * Memory efficient for large graphs - yields leaves one at a time
 * Optimized with index-based queue to avoid O(n) shift() operations
 * @param startLeaf - The leaf to start traversal from
 * @yields Leaves visited in BFS order
 */
export function* lazyBFS<T>(startLeaf: Node<T>): Generator<Node<T>, void, unknown> {
  const visited: Set<Node<T>> = new Set();
  const queue: Node<T>[] = [startLeaf];
  let queueIndex = 0;

  visited.add(startLeaf);

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    yield current;

    for (const branch of current.branches) {
      const nextLeaf = branch.to;
      if (!visited.has(nextLeaf)) {
        visited.add(nextLeaf);
        queue.push(nextLeaf);
      }
    }
  }
}

/**
 * Lazy DFS traversal using generator
 * Memory efficient for large graphs - yields leaves one at a time
 * @param startLeaf - The leaf to start traversal from
 * @yields Leaves visited in DFS order
 */
export function* lazyDFS<T>(startLeaf: Node<T>): Generator<Node<T>, void, unknown> {
  const visited: Set<Node<T>> = new Set();
  const stack: Node<T>[] = [startLeaf];

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);
    yield current;

    // Push neighbors in reverse order to maintain DFS order
    for (let i = current.branches.length - 1; i >= 0; i--) {
      const nextLeaf = current.branches[i].to;
      if (!visited.has(nextLeaf)) {
        stack.push(nextLeaf);
      }
    }
  }
}

/**
 * Lazy path finding - yields paths one at a time
 * Memory efficient for finding many paths
 * @param graph - The graph to search
 * @param from - Starting leaf
 * @param to - Target leaf
 * @param constraints - Path constraints
 * @yields Paths matching the constraints
 */
export function* lazyFindPaths<T>(
  _graph: Graph<T>,
  from: Node<T>,
  to: Node<T>,
  constraints: PathConstraints<T> = {}
): Generator<Node<T>[], void, unknown> {
  const { maxLength, maxWeight, branchFilter, leafFilter, maxPaths } = constraints;
  let pathCount = 0;

  function* dfs(
    current: Node<T>,
    target: Node<T>,
    path: Node<T>[],
    currentWeight: number,
    visited: Set<Node<T>>
  ): Generator<Node<T>[], void, unknown> {
    // Check maxPaths constraint early
    if (maxPaths !== undefined && pathCount >= maxPaths) {
      return;
    }

    // Check if we've reached the target
    if (current === target) {
      if (maxPaths === undefined || pathCount < maxPaths) {
        pathCount++;
        yield [...path];
      }
      return;
    }

    // Check constraints
    if (maxLength !== undefined && path.length >= maxLength) {
      return;
    }

    if (maxWeight !== undefined && currentWeight >= maxWeight) {
      return;
    }

    // Check leaf filter
    if (leafFilter && !leafFilter(current)) {
      return;
    }

    visited.add(current);

    // Explore neighbors - only check branches from current node (not all graph branches)
    for (const branch of current.branches) {
      if (!visited.has(branch.to)) {
        // Check branch filter
        if (branchFilter && !branchFilter(branch)) {
          continue;
        }

        const branchWeight = branch.weight || 0;
        const newWeight = currentWeight + branchWeight;

        // Check weight constraint before exploring
        if (maxWeight !== undefined && newWeight > maxWeight) {
          continue;
        }

        path.push(branch.to);
        yield* dfs(branch.to, target, path, newWeight, visited);
        path.pop();
      }
    }

    visited.delete(current);
  }

  yield* dfs(from, to, [from], 0, new Set());
}

/**
 * Lazy all paths - yields paths one at a time
 * Memory efficient alternative to allPaths for large result sets
 * @param startLeaf - Starting leaf
 * @param endLeaf - Target leaf
 * @yields All paths between start and end leaves
 */
export function* lazyAllPaths<T>(
  startLeaf: Node<T>,
  endLeaf: Node<T>
): Generator<Node<T>[], void, unknown> {
  if (startLeaf === endLeaf) {
    yield [startLeaf];
    return;
  }

  // Use iterative DFS with explicit stack
  const stack: Array<{
    leaf: Node<T>;
    path: Node<T>[];
    visited: Set<Node<T>>;
    branchIndex: number;
  }> = [
    {
      leaf: startLeaf,
      path: [startLeaf],
      visited: new Set([startLeaf]),
      branchIndex: 0,
    },
  ];

  while (stack.length > 0) {
    const state = stack[stack.length - 1];

    if (state.leaf === endLeaf) {
      // Found a path
      yield [...state.path];
      stack.pop();
      continue;
    }

    // Check if we've explored all branches
    if (state.branchIndex >= state.leaf.branches.length) {
      stack.pop();
      continue;
    }

    // Get next branch to explore
    const branch = state.leaf.branches[state.branchIndex];
    state.branchIndex++;

    const nextLeaf = branch.to;

    // Skip if already in current path (avoid cycles)
    if (state.visited.has(nextLeaf)) {
      continue;
    }

    // Create new state for next leaf
    const newPath = [...state.path, nextLeaf];
    const newVisited = new Set(state.visited);
    newVisited.add(nextLeaf);

    stack.push({
      leaf: nextLeaf,
      path: newPath,
      visited: newVisited,
      branchIndex: 0,
    });
  }
}

/**
 * Lazy query leaves - yields matching leaves one at a time
 * Memory efficient for large result sets
 * @param graph - The graph to search
 * @param predicate - Function to test each leaf
 * @param limit - Maximum number of leaves to yield
 * @yields Leaves matching the predicate
 */
export function* lazyFindLeaves<T>(
  graph: Graph<T>,
  predicate: (leaf: Node<T>) => boolean,
  limit?: number
): Generator<Node<T>, void, unknown> {
  let count = 0;
  for (const leaf of graph.leaves()) {
    if (limit !== undefined && count >= limit) {
      return;
    }
    if (predicate(leaf)) {
      count++;
      yield leaf;
    }
  }
}
