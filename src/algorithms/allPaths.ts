import { Node } from '../core/Node';

/**
 * Find all paths between two leaves using DFS
 * Uses iterative backtracking to avoid stack overflow
 * @param startLeaf - Starting leaf
 * @param endLeaf - Target leaf
 * @returns Array of all paths, where each path is an array of leaves
 */
export function allPaths<T>(startLeaf: Node<T>, endLeaf: Node<T>): Node<T>[][] {
  if (startLeaf === endLeaf) {
    return [[startLeaf]];
  }

  const paths: Node<T>[][] = [];

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
      paths.push([...state.path]);
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

  return paths;
}
