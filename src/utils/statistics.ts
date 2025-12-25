import { Graph } from '../core/Graph';
import { Node } from '../core/Node';

/**
 * Graph statistics and metrics
 */
export interface GraphStatistics {
  /**
   * Number of leaves (nodes) in the graph
   */
  leafCount: number;
  /**
   * Number of branches (edges) in the graph
   */
  branchCount: number;
  /**
   * Graph density (ratio of actual branches to possible branches)
   * For directed graphs: density = branches / (leaves * (leaves - 1))
   * For undirected graphs: density = branches / (leaves * (leaves - 1) / 2)
   */
  density: number;
  /**
   * Average degree (average number of branches per leaf)
   */
  averageDegree: number;
  /**
   * Maximum degree (maximum number of branches connected to a single leaf)
   */
  maxDegree: number;
  /**
   * Minimum degree (minimum number of branches connected to a single leaf)
   */
  minDegree: number;
  /**
   * Number of isolated leaves (leaves with no branches)
   */
  isolatedLeaves: number;
  /**
   * Whether the graph is empty
   */
  isEmpty: boolean;
  /**
   * Whether the graph has any branches
   */
  hasBranches: boolean;
  /**
   * Total weight of all branches (if weighted)
   */
  totalWeight?: number;
  /**
   * Average branch weight (if weighted)
   */
  averageWeight?: number;
}

/**
 * Calculate graph statistics and metrics
 * Uses tree metaphor: analyzes leaves and branches
 *
 * @param graph - The graph to analyze
 * @param directed - Whether the graph is directed (default: true)
 * @returns Graph statistics object
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * graph.addBranch(a, b, 5);
 *
 * const stats = getStatistics(graph);
 * // { leafCount: 2, branchCount: 1, density: 0.5, ... }
 * ```
 */
export function getStatistics<T>(graph: Graph<T>, directed: boolean = true): GraphStatistics {
  const leaves = graph.leaves();
  const branches = graph.branches();
  const leafCount = leaves.length;
  const branchCount = branches.length;

  // Calculate degrees
  const degrees = new Map<Node<T>, number>();
  for (const leaf of leaves) {
    degrees.set(leaf, 0);
  }

  for (const branch of branches) {
    const fromDegree = degrees.get(branch.from) || 0;
    degrees.set(branch.from, fromDegree + 1);

    if (!directed) {
      const toDegree = degrees.get(branch.to) || 0;
      degrees.set(branch.to, toDegree + 1);
    } else {
      const toDegree = degrees.get(branch.to) || 0;
      degrees.set(branch.to, toDegree + 1);
    }
  }

  const degreeValues = Array.from(degrees.values());
  const maxDegree = leafCount > 0 ? Math.max(...degreeValues, 0) : 0;
  const minDegree = leafCount > 0 ? Math.min(...degreeValues, 0) : 0;
  const averageDegree = leafCount > 0 ? branchCount / leafCount : 0;

  // Calculate density
  let maxPossibleBranches: number;
  if (leafCount <= 1) {
    maxPossibleBranches = 0;
  } else if (directed) {
    maxPossibleBranches = leafCount * (leafCount - 1);
  } else {
    maxPossibleBranches = (leafCount * (leafCount - 1)) / 2;
  }
  const density = maxPossibleBranches > 0 ? branchCount / maxPossibleBranches : 0;

  // Count isolated leaves
  const isolatedLeaves = degreeValues.filter(d => d === 0).length;

  // Calculate weights if present
  let totalWeight: number | undefined;
  let averageWeight: number | undefined;
  const weightedBranches = branches.filter(b => b.weight !== undefined);
  if (weightedBranches.length > 0) {
    totalWeight = weightedBranches.reduce((sum, b) => sum + (b.weight || 0), 0);
    averageWeight = totalWeight / weightedBranches.length;
  }

  return {
    leafCount,
    branchCount,
    density,
    averageDegree,
    maxDegree,
    minDegree,
    isolatedLeaves,
    isEmpty: leafCount === 0,
    hasBranches: branchCount > 0,
    totalWeight,
    averageWeight,
  };
}
