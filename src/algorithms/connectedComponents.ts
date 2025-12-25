import { Graph } from '../core/Graph';
import { Node } from '../core/Node';

/**
 * Find all connected components in an undirected graph
 * Uses tree metaphor: finds all disconnected subtrees
 *
 * @param graph - The graph to analyze
 * @returns Array of connected components, each containing leaves in that component
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * const c = graph.addLeaf('C', 'c');
 * graph.addBranch(a, b);
 * // c is isolated
 *
 * const components = findConnectedComponents(graph);
 * // Returns [[a, b], [c]]
 * ```
 */
export function findConnectedComponents<T>(graph: Graph<T>): Node<T>[][] {
  const visited = new Set<Node<T>>();
  const components: Node<T>[][] = [];

  for (const leaf of graph.leaves()) {
    if (!visited.has(leaf)) {
      const component: Node<T>[] = [];
      dfsComponent(leaf, graph, visited, component);
      components.push(component);
    }
  }

  return components;
}

/**
 * DFS helper to find all leaves in a connected component
 */
function dfsComponent<T>(
  start: Node<T>,
  graph: Graph<T>,
  visited: Set<Node<T>>,
  component: Node<T>[]
): void {
  visited.add(start);
  component.push(start);

  // Visit all neighbors (both incoming and outgoing branches)
  for (const branch of graph.branches()) {
    let neighbor: Node<T> | null = null;

    if (branch.from === start && !visited.has(branch.to)) {
      neighbor = branch.to;
    } else if (branch.to === start && !visited.has(branch.from)) {
      neighbor = branch.from;
    }

    if (neighbor) {
      dfsComponent(neighbor, graph, visited, component);
    }
  }
}

/**
 * Find strongly connected components in a directed graph
 * Uses tree metaphor: finds all strongly connected subtrees
 *
 * @param graph - The directed graph to analyze
 * @returns Array of strongly connected components
 */
export function findStronglyConnectedComponents<T>(graph: Graph<T>): Node<T>[][] {
  const visited = new Set<Node<T>>();
  const finished: Node<T>[] = [];
  const components: Node<T>[][] = [];

  // First DFS pass: record finishing times
  for (const leaf of graph.leaves()) {
    if (!visited.has(leaf)) {
      dfsFinishTime(leaf, graph, visited, finished);
    }
  }

  // Create reversed graph
  const reversedGraph = reverseGraph(graph);

  // Second DFS pass on reversed graph in reverse finishing order
  visited.clear();
  finished.reverse();

  for (const leaf of finished) {
    if (!visited.has(leaf)) {
      const component: Node<T>[] = [];
      dfsComponentDirected(leaf, reversedGraph, visited, component);
      components.push(component);
    }
  }

  return components;
}

/**
 * DFS to record finishing times
 */
function dfsFinishTime<T>(
  start: Node<T>,
  graph: Graph<T>,
  visited: Set<Node<T>>,
  finished: Node<T>[]
): void {
  visited.add(start);

  for (const branch of graph.branches()) {
    if (branch.from === start && !visited.has(branch.to)) {
      dfsFinishTime(branch.to, graph, visited, finished);
    }
  }

  finished.push(start);
}

/**
 * DFS for directed graph component
 */
function dfsComponentDirected<T>(
  start: Node<T>,
  graph: Graph<T>,
  visited: Set<Node<T>>,
  component: Node<T>[]
): void {
  visited.add(start);
  component.push(start);

  for (const branch of graph.branches()) {
    if (branch.from === start && !visited.has(branch.to)) {
      dfsComponentDirected(branch.to, graph, visited, component);
    }
  }
}

/**
 * Helper to create reversed graph
 */
function reverseGraph<T>(graph: Graph<T>): Graph<T> {
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
 * Count the number of connected components
 *
 * @param graph - The graph to analyze
 * @returns Number of connected components
 */
export function countConnectedComponents<T>(graph: Graph<T>): number {
  return findConnectedComponents(graph).length;
}
