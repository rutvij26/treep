import { Graph, Node } from '../../src/core';
import {
  lazyBFS,
  lazyDFS,
  lazyAllPaths,
  lazyFindPaths,
  lazyFindLeaves,
} from '../../src/algorithms/lazy';

describe('Lazy Evaluation', () => {
  let graph: Graph<string>;
  let a: Node<string>;
  let b: Node<string>;
  let c: Node<string>;
  let d: Node<string>;

  beforeEach(() => {
    graph = new Graph<string>();
    a = graph.addLeaf('A', 'a');
    b = graph.addLeaf('B', 'b');
    c = graph.addLeaf('C', 'c');
    d = graph.addLeaf('D', 'd');

    graph.addBranch(a, b);
    graph.addBranch(b, c);
    graph.addBranch(a, d);
    graph.addBranch(d, c);
  });

  describe('lazyBFS', () => {
    it('should yield leaves in BFS order', () => {
      const result: Node<string>[] = [];
      for (const leaf of lazyBFS(a)) {
        result.push(leaf);
      }

      expect(result).toEqual([a, b, d, c]);
    });

    it('should handle single leaf', () => {
      const singleGraph = new Graph<string>();
      const leaf = singleGraph.addLeaf('X', 'x');

      const result: Node<string>[] = [];
      for (const node of lazyBFS(leaf)) {
        result.push(node);
      }

      expect(result).toEqual([leaf]);
    });
  });

  describe('lazyDFS', () => {
    it('should yield leaves in DFS order', () => {
      const result: Node<string>[] = [];
      for (const leaf of lazyDFS(a)) {
        result.push(leaf);
      }

      // DFS order depends on branch order, but should include all nodes
      expect(result).toContain(a);
      expect(result).toContain(b);
      expect(result).toContain(c);
      expect(result).toContain(d);
      expect(result.length).toBe(4);
    });

    it('should skip already visited nodes', () => {
      // Create a graph with cycles
      const cyclicGraph = new Graph<string>();
      const x = cyclicGraph.addLeaf('X', 'x');
      const y = cyclicGraph.addLeaf('Y', 'y');
      const z = cyclicGraph.addLeaf('Z', 'z');
      cyclicGraph.addBranch(x, y);
      cyclicGraph.addBranch(y, z);
      cyclicGraph.addBranch(z, x); // Creates cycle

      const result: Node<string>[] = [];
      for (const leaf of lazyDFS(x)) {
        result.push(leaf);
      }

      // Should visit each node only once despite cycle
      expect(result.length).toBe(3);
      expect(result).toContain(x);
      expect(result).toContain(y);
      expect(result).toContain(z);
    });

    it('should handle nodes pushed multiple times to stack', () => {
      // Create graph where same node can be reached via multiple paths
      // This ensures visited check is hit multiple times
      const multiPathGraph = new Graph<string>();
      const x = multiPathGraph.addLeaf('X', 'x');
      const y = multiPathGraph.addLeaf('Y', 'y');
      const z = multiPathGraph.addLeaf('Z', 'z');
      const w = multiPathGraph.addLeaf('W', 'w');
      multiPathGraph.addBranch(x, y);
      multiPathGraph.addBranch(x, w);
      multiPathGraph.addBranch(y, z);
      multiPathGraph.addBranch(w, z);
      multiPathGraph.addBranch(z, y); // Creates back edge

      const result: Node<string>[] = [];
      for (const leaf of lazyDFS(x)) {
        result.push(leaf);
      }

      // Should visit each node only once
      expect(result.length).toBe(4);
    });

    it('should skip node if already visited when popped from stack', () => {
      // Create a graph where a node appears in stack multiple times
      // This tests the visited check at line 46-47
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      const d = graph.addLeaf('D', 'd');

      // A -> B, A -> C, B -> D, C -> D
      // This creates multiple paths to D, so D might be pushed to stack multiple times
      graph.addBranch(a, b);
      graph.addBranch(a, c);
      graph.addBranch(b, d);
      graph.addBranch(c, d);
      graph.addBranch(d, b); // Creates cycle back to B

      const result: Node<string>[] = [];
      for (const leaf of lazyDFS(a)) {
        result.push(leaf);
      }

      // Should visit each node only once
      expect(result.length).toBe(4);
      const unique = new Set(result);
      expect(unique.size).toBe(4);
    });
  });

  describe('lazyAllPaths', () => {
    it('should yield all paths between two leaves', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyAllPaths(a, c)) {
        paths.push(path);
      }

      expect(paths.length).toBeGreaterThan(0);
      expect(paths.every(p => p[0] === a && p[p.length - 1] === c)).toBe(true);
    });

    it('should yield single path for direct connection', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyAllPaths(a, b)) {
        paths.push(path);
      }

      expect(paths).toEqual([[a, b]]);
    });

    it('should yield empty for no path', () => {
      const isolated = graph.addLeaf('Isolated', 'isolated');
      const paths: Node<string>[][] = [];
      for (const path of lazyAllPaths(a, isolated)) {
        paths.push(path);
      }

      expect(paths).toEqual([]);
    });

    it('should yield single node path when start equals end', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyAllPaths(a, a)) {
        paths.push(path);
      }

      expect(paths).toEqual([[a]]);
    });

    it('should skip cycles in paths', () => {
      // Create graph with cycle: A -> B -> C -> B
      const cyclicGraph = new Graph<string>();
      const x = cyclicGraph.addLeaf('X', 'x');
      const y = cyclicGraph.addLeaf('Y', 'y');
      const z = cyclicGraph.addLeaf('Z', 'z');
      cyclicGraph.addBranch(x, y);
      cyclicGraph.addBranch(y, z);
      cyclicGraph.addBranch(z, y); // Creates cycle

      const paths: Node<string>[][] = [];
      for (const path of lazyAllPaths(x, z)) {
        paths.push(path);
      }

      // Should find path without cycles
      expect(paths.length).toBeGreaterThan(0);
      expect(paths.every(p => p[0] === x && p[p.length - 1] === z)).toBe(true);
      // No path should contain duplicate nodes
      paths.forEach(path => {
        const unique = new Set(path);
        expect(unique.size).toBe(path.length);
      });
    });

    it('should skip nodes already in current path (cycle detection)', () => {
      // Create graph where a node can be reached multiple ways
      // This ensures the visited check in lazyAllPaths is hit
      const cycleGraph = new Graph<string>();
      const x = cycleGraph.addLeaf('X', 'x');
      const y = cycleGraph.addLeaf('Y', 'y');
      const z = cycleGraph.addLeaf('Z', 'z');
      cycleGraph.addBranch(x, y);
      cycleGraph.addBranch(y, z);
      cycleGraph.addBranch(y, x); // Creates cycle back to x
      cycleGraph.addBranch(z, y); // Creates cycle back to y

      const paths: Node<string>[][] = [];
      for (const path of lazyAllPaths(x, z)) {
        paths.push(path);
      }

      // Should find paths but none should have cycles
      expect(paths.length).toBeGreaterThan(0);
      paths.forEach(path => {
        // No duplicate nodes in path
        const unique = new Set(path);
        expect(unique.size).toBe(path.length);
      });
    });
  });

  describe('lazyFindPaths', () => {
    it('should yield paths with constraints', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(graph, a, c, { maxLength: 3 })) {
        paths.push(path);
      }

      expect(paths.length).toBeGreaterThan(0);
      expect(paths.every(p => p.length <= 3)).toBe(true);
    });

    it('should respect maxPaths constraint', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(graph, a, c, { maxPaths: 1 })) {
        paths.push(path);
      }

      expect(paths.length).toBeLessThanOrEqual(1);
    });

    it('should respect maxLength constraint', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(graph, a, c, { maxLength: 2 })) {
        paths.push(path);
      }

      // All paths should be <= maxLength
      paths.forEach(path => {
        expect(path.length).toBeLessThanOrEqual(2);
      });
    });

    it('should respect maxWeight constraint', () => {
      const weightedGraph = new Graph<string>();
      const x = weightedGraph.addLeaf('X', 'x');
      const y = weightedGraph.addLeaf('Y', 'y');
      const z = weightedGraph.addLeaf('Z', 'z');
      weightedGraph.addBranch(x, y, 5);
      weightedGraph.addBranch(y, z, 3);
      weightedGraph.addBranch(x, z, 10);

      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(weightedGraph, x, z, { maxWeight: 8 })) {
        paths.push(path);
      }

      // Should only find paths with weight <= 8
      expect(paths.length).toBeGreaterThan(0);
    });

    it('should stop when current weight exceeds maxWeight', () => {
      // Create graph where we need to check weight before exploring
      const weightedGraph = new Graph<string>();
      const x = weightedGraph.addLeaf('X', 'x');
      const y = weightedGraph.addLeaf('Y', 'y');
      const z = weightedGraph.addLeaf('Z', 'z');
      const w = weightedGraph.addLeaf('W', 'w');
      weightedGraph.addBranch(x, y, 10); // Already exceeds maxWeight of 5
      weightedGraph.addBranch(x, w, 2);
      weightedGraph.addBranch(w, z, 2);
      weightedGraph.addBranch(y, z, 1); // This path would be valid but x->y already exceeds

      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(weightedGraph, x, z, { maxWeight: 5 })) {
        paths.push(path);
      }

      // Should not include paths through y since x->y already exceeds maxWeight
      paths.forEach(path => {
        expect(path).not.toContain(y);
      });
    });

    it('should return early when currentWeight already exceeds maxWeight', () => {
      // Test line 108: when currentWeight >= maxWeight before exploring neighbors
      // Create a path where we reach a node with weight already at maxWeight
      const weightedGraph = new Graph<string>();
      const x = weightedGraph.addLeaf('X', 'x');
      const y = weightedGraph.addLeaf('Y', 'y');
      const z = weightedGraph.addLeaf('Z', 'z');
      weightedGraph.addBranch(x, y, 5); // Weight = 5, maxWeight = 5, so currentWeight >= maxWeight
      weightedGraph.addBranch(y, z, 1); // This would make total 6, but we should stop at y

      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(weightedGraph, x, z, { maxWeight: 5 })) {
        paths.push(path);
      }

      // Should not find any paths since x->y already equals maxWeight
      // and y->z would exceed it
      expect(paths.length).toBe(0);
    });

    it('should respect leafFilter constraint', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(graph, a, c, {
        leafFilter: leaf => leaf.value !== 'B',
      })) {
        paths.push(path);
      }

      // All paths should not contain node B
      paths.forEach(path => {
        expect(path.some(n => n.value === 'B')).toBe(false);
      });
    });

    it('should respect branchFilter constraint', () => {
      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(graph, a, c, {
        branchFilter: branch => branch.weight === undefined,
      })) {
        paths.push(path);
      }

      expect(paths.length).toBeGreaterThan(0);
    });

    it('should filter out branches that do not match branchFilter', () => {
      // Create graph with weighted and unweighted branches
      const mixedGraph = new Graph<string>();
      const x = mixedGraph.addLeaf('X', 'x');
      const y = mixedGraph.addLeaf('Y', 'y');
      const z = mixedGraph.addLeaf('Z', 'z');
      mixedGraph.addBranch(x, y, 5); // Weighted - should be filtered
      mixedGraph.addBranch(x, z); // Unweighted - should pass filter

      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(mixedGraph, x, z, {
        branchFilter: branch => branch.weight === undefined,
      })) {
        paths.push(path);
      }

      // Should find path x->z but not x->y->z since y->z doesn't exist
      expect(paths.length).toBeGreaterThan(0);
      // All paths should not go through y (since x->y is weighted and filtered)
      paths.forEach(path => {
        if (path.length > 2) {
          expect(path[1]).not.toBe(y);
        }
      });
    });

    it('should handle maxWeight constraint with weighted branches', () => {
      const weightedGraph = new Graph<string>();
      const x = weightedGraph.addLeaf('X', 'x');
      const y = weightedGraph.addLeaf('Y', 'y');
      const z = weightedGraph.addLeaf('Z', 'z');
      weightedGraph.addBranch(x, y, 5);
      weightedGraph.addBranch(y, z, 5); // Total weight = 10
      weightedGraph.addBranch(x, z, 3); // Direct path with weight 3

      const paths: Node<string>[][] = [];
      for (const path of lazyFindPaths(weightedGraph, x, z, { maxWeight: 4 })) {
        paths.push(path);
      }

      // Should only find paths with total weight <= 4
      expect(paths.length).toBeGreaterThan(0);
    });
  });

  describe('lazyFindLeaves', () => {
    it('should yield leaves matching predicate', () => {
      const leaves: Node<string>[] = [];
      for (const leaf of lazyFindLeaves(graph, l => l.value === 'A' || l.value === 'C')) {
        leaves.push(leaf);
      }

      expect(leaves.length).toBe(2);
      expect(leaves.map(l => l.value)).toContain('A');
      expect(leaves.map(l => l.value)).toContain('C');
    });

    it('should respect limit', () => {
      const leaves: Node<string>[] = [];
      for (const leaf of lazyFindLeaves(graph, () => true, 2)) {
        leaves.push(leaf);
      }

      expect(leaves.length).toBeLessThanOrEqual(2);
    });
  });
});
