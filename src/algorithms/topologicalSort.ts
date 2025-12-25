import { Graph } from '../core/Graph';
import { Node } from '../core/Node';
import { GraphError } from '../errors/GraphError';

/**
 * Perform topological sort on a directed acyclic graph (DAG)
 * Uses tree metaphor: sorts leaves in dependency order
 *
 * @param graph - The graph to sort
 * @returns Array of leaves in topological order
 * @throws GraphError if graph contains cycles
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * const c = graph.addLeaf('C', 'c');
 * graph.addBranch(a, b);
 * graph.addBranch(b, c);
 *
 * const sorted = topologicalSort(graph);
 * // Returns [a, b, c] - dependencies resolved
 * ```
 */
export function topologicalSort<T>(graph: Graph<T>): Node<T>[] {
  const leaves = graph.leaves();
  const inDegree = new Map<Node<T>, number>();
  const result: Node<T>[] = [];
  const queue: Node<T>[] = [];

  // Initialize in-degree for all leaves
  for (const leaf of leaves) {
    inDegree.set(leaf, 0);
  }

  // Calculate in-degree (number of incoming branches)
  for (const branch of graph.branches()) {
    const currentInDegree = inDegree.get(branch.to) || 0;
    inDegree.set(branch.to, currentInDegree + 1);
  }

  // Find all leaves with no incoming branches (roots)
  for (const leaf of leaves) {
    if ((inDegree.get(leaf) || 0) === 0) {
      queue.push(leaf);
    }
  }

  // Process leaves
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    // Decrease in-degree for all neighbors
    for (const branch of graph.branches()) {
      if (branch.from === current) {
        const neighborInDegree = inDegree.get(branch.to) || 0;
        inDegree.set(branch.to, neighborInDegree - 1);

        // If in-degree becomes 0, add to queue
        if (neighborInDegree - 1 === 0) {
          queue.push(branch.to);
        }
      }
    }
  }

  // Check for cycles (if result length < total leaves, there's a cycle)
  if (result.length < leaves.length) {
    throw new GraphError('Graph contains cycles, topological sort not possible', 'CYCLE_DETECTED');
  }

  return result;
}

/**
 * Check if graph is a DAG (Directed Acyclic Graph)
 *
 * @param graph - The graph to check
 * @returns True if graph is acyclic, false otherwise
 */
export function isDAG<T>(graph: Graph<T>): boolean {
  try {
    topologicalSort(graph);
    return true;
  } catch (error) {
    if (error instanceof GraphError && error.code === 'CYCLE_DETECTED') {
      return false;
    }
    throw error;
  }
}
