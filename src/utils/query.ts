import { Graph } from '../core/Graph';
import { Node } from '../core/Node';
import { Branch } from '../core/Branch';

/**
 * Predicate function for filtering leaves
 */
export type LeafPredicate<T> = (leaf: Node<T>) => boolean;

/**
 * Predicate function for filtering branches
 */
export type BranchPredicate<T> = (branch: Branch<T>) => boolean;

/**
 * Options for querying leaves
 */
export interface QueryLeavesOptions {
  /**
   * Maximum number of results to return
   */
  limit?: number;
  /**
   * Offset for pagination
   */
  offset?: number;
}

/**
 * Find leaves matching a predicate
 * Uses tree metaphor: queries leaves (nodes) in the graph
 *
 * @param graph - The graph to query
 * @param predicate - Function that returns true for matching leaves
 * @param options - Query options
 * @returns Array of matching leaves
 *
 * @example
 * ```typescript
 * const graph = new Graph<{ name: string; age: number }>();
 * graph.addLeaf({ name: 'Alice', age: 30 }, 'a');
 * graph.addLeaf({ name: 'Bob', age: 25 }, 'b');
 *
 * const adults = findLeaves(graph, leaf => leaf.value.age >= 18);
 * ```
 */
export function findLeaves<T>(
  graph: Graph<T>,
  predicate: LeafPredicate<T>,
  options: QueryLeavesOptions = {}
): Node<T>[] {
  const { limit, offset = 0 } = options;
  const allLeaves = graph.leaves();
  const matching = allLeaves.filter(predicate);

  const sliced = matching.slice(offset);
  return limit !== undefined ? sliced.slice(0, limit) : sliced;
}

/**
 * Find a single leaf matching a predicate
 *
 * @param graph - The graph to query
 * @param predicate - Function that returns true for matching leaf
 * @returns First matching leaf or undefined
 */
export function findLeaf<T>(graph: Graph<T>, predicate: LeafPredicate<T>): Node<T> | undefined {
  return graph.leaves().find(predicate);
}

/**
 * Find branches matching a predicate
 * Uses tree metaphor: queries branches (edges) in the graph
 *
 * @param graph - The graph to query
 * @param predicate - Function that returns true for matching branches
 * @param options - Query options
 * @returns Array of matching branches
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b, 5);
 * graph.addBranch(b, a, 3);
 *
 * const heavyBranches = findBranches(graph, branch => (branch.weight || 0) > 4);
 * ```
 */
export function findBranches<T>(
  graph: Graph<T>,
  predicate: BranchPredicate<T>,
  options: QueryLeavesOptions = {}
): Branch<T>[] {
  const { limit, offset = 0 } = options;
  const allBranches = graph.branches();
  const matching = allBranches.filter(predicate);

  const sliced = matching.slice(offset);
  return limit !== undefined ? sliced.slice(0, limit) : sliced;
}

/**
 * Find a single branch matching a predicate
 *
 * @param graph - The graph to query
 * @param predicate - Function that returns true for matching branch
 * @returns First matching branch or undefined
 */
export function findBranch<T>(
  graph: Graph<T>,
  predicate: BranchPredicate<T>
): Branch<T> | undefined {
  return graph.branches().find(predicate);
}

/**
 * Filter leaves by value property
 *
 * @param graph - The graph to query
 * @param property - Property name to check
 * @param value - Value to match
 * @returns Array of leaves with matching property value
 */
export function filterLeavesByValue<T>(
  graph: Graph<T>,
  property: string,
  value: unknown
): Node<T>[] {
  return findLeaves(graph, leaf => {
    const leafValue = leaf.value as Record<string, unknown>;
    return leafValue && leafValue[property] === value;
  });
}

/**
 * Filter branches by weight range
 *
 * @param graph - The graph to query
 * @param minWeight - Minimum weight (inclusive)
 * @param maxWeight - Maximum weight (inclusive)
 * @returns Array of branches within weight range
 */
export function filterBranchesByWeight<T>(
  graph: Graph<T>,
  minWeight: number,
  maxWeight: number
): Branch<T>[] {
  return findBranches(graph, branch => {
    const weight = branch.weight ?? 0;
    return weight >= minWeight && weight <= maxWeight;
  });
}
