import { Graph } from '../core/Graph';
import { Node } from '../core/Node';

/**
 * Reverse all branches in a graph (transpose)
 * Uses tree metaphor: reverses direction of all branches
 *
 * @param graph - The graph to reverse
 * @returns New graph with reversed branches
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b);
 *
 * const reversed = reverseGraph(graph);
 * // Now reversed has branch from b to a
 * ```
 */
export function reverseGraph<T>(graph: Graph<T>): Graph<T> {
  const reversed = new Graph<T>();

  // Add all leaves
  for (const leaf of graph.leaves()) {
    reversed.addLeaf(leaf.value, leaf.id);
  }

  // Reverse all branches
  for (const branch of graph.branches()) {
    const fromLeaf = reversed.getLeaf(branch.to.id);
    const toLeaf = reversed.getLeaf(branch.from.id);
    if (fromLeaf && toLeaf) {
      reversed.addBranch(fromLeaf, toLeaf, branch.weight);
    }
  }

  return reversed;
}

/**
 * Convert directed graph to undirected graph
 * Uses tree metaphor: makes all branches bidirectional
 *
 * @param graph - The directed graph to convert
 * @returns New undirected graph
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b, 5);
 *
 * const undirected = toUndirected(graph);
 * // Now has both a->b and b->a branches
 * ```
 */
export function toUndirected<T>(graph: Graph<T>): Graph<T> {
  const undirected = new Graph<T>();

  // Add all leaves
  for (const leaf of graph.leaves()) {
    undirected.addLeaf(leaf.value, leaf.id);
  }

  // Add bidirectional branches
  const addedBranches = new Set<string>();

  for (const branch of graph.branches()) {
    const fromLeaf = undirected.getLeaf(branch.from.id);
    const toLeaf = undirected.getLeaf(branch.to.id);

    if (!fromLeaf || !toLeaf) {
      continue;
    }

    // Create key for branch pair (order-independent)
    const key1 = `${branch.from.id}-${branch.to.id}`;
    const key2 = `${branch.to.id}-${branch.from.id}`;

    // Add branch in original direction
    if (!addedBranches.has(key1) && !addedBranches.has(key2)) {
      undirected.addBranch(fromLeaf, toLeaf, branch.weight);
      addedBranches.add(key1);
    }

    // Add branch in reverse direction (if not already added)
    if (!addedBranches.has(key2)) {
      undirected.addBranch(toLeaf, fromLeaf, branch.weight);
      addedBranches.add(key2);
    }
  }

  return undirected;
}

/**
 * Transpose a graph (same as reverse)
 * Uses tree metaphor: transposes branch directions
 *
 * @param graph - The graph to transpose
 * @returns New transposed graph
 */
export function transpose<T>(graph: Graph<T>): Graph<T> {
  return reverseGraph(graph);
}

/**
 * Create a subgraph with only specified branches
 *
 * @param graph - The source graph
 * @param branchFilter - Function to filter branches
 * @returns New graph containing only filtered branches and their leaves
 */
export function filterBranches<T>(
  graph: Graph<T>,
  branchFilter: (branch: import('../core/Branch').Branch<T>) => boolean
): Graph<T> {
  const filtered = new Graph<T>();
  const addedLeaves = new Set<string | number>();

  // Add leaves that are part of filtered branches
  for (const branch of graph.branches()) {
    if (branchFilter(branch)) {
      if (!addedLeaves.has(branch.from.id)) {
        filtered.addLeaf(branch.from.value, branch.from.id);
        addedLeaves.add(branch.from.id);
      }
      if (!addedLeaves.has(branch.to.id)) {
        filtered.addLeaf(branch.to.value, branch.to.id);
        addedLeaves.add(branch.to.id);
      }
    }
  }

  // Add filtered branches
  for (const branch of graph.branches()) {
    if (branchFilter(branch)) {
      const fromLeaf = filtered.getLeaf(branch.from.id);
      const toLeaf = filtered.getLeaf(branch.to.id);
      if (fromLeaf && toLeaf) {
        filtered.addBranch(fromLeaf, toLeaf, branch.weight);
      }
    }
  }

  return filtered;
}

/**
 * Create a subgraph with only specified leaves and their branches
 *
 * @param graph - The source graph
 * @param leafFilter - Function to filter leaves
 * @returns New graph containing only filtered leaves and branches between them
 */
export function filterLeaves<T>(graph: Graph<T>, leafFilter: (leaf: Node<T>) => boolean): Graph<T> {
  const filtered = new Graph<T>();
  const filteredLeaves = new Set<string | number>();

  // Add filtered leaves
  for (const leaf of graph.leaves()) {
    if (leafFilter(leaf)) {
      filtered.addLeaf(leaf.value, leaf.id);
      filteredLeaves.add(leaf.id);
    }
  }

  // Add branches between filtered leaves
  for (const branch of graph.branches()) {
    if (filteredLeaves.has(branch.from.id) && filteredLeaves.has(branch.to.id)) {
      const fromLeaf = filtered.getLeaf(branch.from.id);
      const toLeaf = filtered.getLeaf(branch.to.id);
      if (fromLeaf && toLeaf) {
        filtered.addBranch(fromLeaf, toLeaf, branch.weight);
      }
    }
  }

  return filtered;
}
