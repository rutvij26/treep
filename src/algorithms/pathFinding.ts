import { Graph } from '../core/Graph';
import { Node } from '../core/Node';
import { Branch } from '../core/Branch';

/**
 * Constraints for path finding
 */
export interface PathConstraints<T> {
  /**
   * Maximum path length (number of branches)
   */
  maxLength?: number;
  /**
   * Maximum path weight (sum of branch weights)
   */
  maxWeight?: number;
  /**
   * Predicate to filter allowed branches
   */
  branchFilter?: (branch: Branch<T>) => boolean;
  /**
   * Predicate to filter allowed leaves
   */
  leafFilter?: (leaf: Node<T>) => boolean;
  /**
   * Maximum number of paths to return
   */
  maxPaths?: number;
}

/**
 * Find all paths between two leaves with constraints
 * Uses tree metaphor: finds all branch paths between leaves
 *
 * @param graph - The graph to search
 * @param from - Starting leaf
 * @param to - Target leaf
 * @param constraints - Path constraints
 * @returns Array of paths (each path is an array of leaves)
 *
 * @example
 * ```typescript
 * const graph = new Graph<string>();
 * const a = graph.addLeaf('A', 'a');
 * const b = graph.addLeaf('B', 'b');
 * const c = graph.addLeaf('C', 'c');
 * graph.addBranch(a, b, 5);
 * graph.addBranch(b, c, 3);
 * graph.addBranch(a, c, 10);
 *
 * const paths = findPathsWithConstraints(graph, a, c, { maxWeight: 8 });
 * // Returns [[a, b, c]] - only path with weight <= 8
 * ```
 */
export function findPathsWithConstraints<T>(
  graph: Graph<T>,
  from: Node<T>,
  to: Node<T>,
  constraints: PathConstraints<T> = {}
): Node<T>[][] {
  const { maxLength, maxWeight, branchFilter, leafFilter, maxPaths } = constraints;

  const paths: Node<T>[][] = [];
  const visited = new Set<Node<T>>();

  function dfs(current: Node<T>, target: Node<T>, path: Node<T>[], currentWeight: number): void {
    // Check maxPaths constraint early - before exploring
    if (maxPaths !== undefined && paths.length >= maxPaths) {
      return;
    }

    // Check if we've reached the target
    if (current === target) {
      // Only add if we haven't exceeded maxPaths
      if (maxPaths === undefined || paths.length < maxPaths) {
        paths.push([...path]);
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

    // Explore neighbors
    for (const branch of graph.branches()) {
      if (branch.from === current && !visited.has(branch.to)) {
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
        dfs(branch.to, target, path, newWeight);
        path.pop();
      }
    }

    visited.delete(current);
  }

  dfs(from, to, [from], 0);
  return paths;
}

/**
 * Find shortest path with constraints
 *
 * @param graph - The graph to search
 * @param from - Starting leaf
 * @param to - Target leaf
 * @param constraints - Path constraints
 * @returns Shortest path or empty array if no path exists
 */
export function findShortestPathWithConstraints<T>(
  graph: Graph<T>,
  from: Node<T>,
  to: Node<T>,
  constraints: PathConstraints<T> = {}
): Node<T>[] {
  // Get all paths (or up to a reasonable limit) to find the shortest
  // Remove maxPaths from constraints to get all paths, but respect user's maxPaths if set
  const { maxPaths, ...otherConstraints } = constraints;
  const paths = findPathsWithConstraints(graph, from, to, {
    ...otherConstraints,
    maxPaths: maxPaths || 100, // Default to 100 to get multiple paths for comparison
  });

  if (paths.length === 0) {
    return [];
  }

  // Calculate weights for all paths and return shortest
  let shortestPath = paths[0];
  let shortestWeight = calculatePathWeight(graph, shortestPath);

  for (const path of paths) {
    const weight = calculatePathWeight(graph, path);
    if (weight < shortestWeight) {
      shortestWeight = weight;
      shortestPath = path;
    }
  }

  return shortestPath;
}

/**
 * Calculate total weight of a path
 */
function calculatePathWeight<T>(graph: Graph<T>, path: Node<T>[]): number {
  let weight = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];

    for (const branch of graph.branches()) {
      if (branch.from === from && branch.to === to) {
        weight += branch.weight || 0;
        break;
      }
    }
  }

  return weight;
}

/**
 * Find all paths avoiding specific leaves
 *
 * @param graph - The graph to search
 * @param from - Starting leaf
 * @param to - Target leaf
 * @param avoidLeaves - Leaves to avoid in path
 * @returns Array of paths avoiding specified leaves
 */
export function findPathsAvoiding<T>(
  graph: Graph<T>,
  from: Node<T>,
  to: Node<T>,
  avoidLeaves: Node<T>[]
): Node<T>[][] {
  const avoidSet = new Set(avoidLeaves);
  return findPathsWithConstraints(graph, from, to, {
    leafFilter: leaf => !avoidSet.has(leaf),
  });
}

/**
 * Find all paths through required leaves
 *
 * @param graph - The graph to search
 * @param from - Starting leaf
 * @param to - Target leaf
 * @param requiredLeaves - Leaves that must be in path
 * @returns Array of paths containing all required leaves
 */
export function findPathsThrough<T>(
  graph: Graph<T>,
  from: Node<T>,
  to: Node<T>,
  requiredLeaves: Node<T>[]
): Node<T>[][] {
  const allPaths = findPathsWithConstraints(graph, from, to);
  const requiredSet = new Set(requiredLeaves);

  return allPaths.filter(path => {
    const pathSet = new Set(path);
    for (const required of requiredSet) {
      if (!pathSet.has(required)) {
        return false;
      }
    }
    return true;
  });
}
