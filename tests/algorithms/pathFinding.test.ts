import { Graph } from '../../src/core/Graph';
import {
  findPathsWithConstraints,
  findShortestPathWithConstraints,
  findPathsAvoiding,
  findPathsThrough,
} from '../../src/algorithms/pathFinding';

describe('Path Finding with Constraints', () => {
  let graph: Graph<string>;

  beforeEach(() => {
    graph = new Graph<string>();
  });

  describe('findPathsWithConstraints', () => {
    it('should find paths with maxLength constraint', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);
      graph.addBranch(a, c);

      const paths = findPathsWithConstraints(graph, a, c, { maxLength: 2 });

      expect(paths.length).toBeGreaterThan(0);
      expect(paths.every(path => path.length <= 2)).toBe(true);
    });

    it('should find paths with maxWeight constraint', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(b, c, 3);
      graph.addBranch(a, c, 10);

      const paths = findPathsWithConstraints(graph, a, c, { maxWeight: 8 });

      expect(paths.length).toBeGreaterThan(0);
      expect(
        paths.every(path => {
          let weight = 0;
          for (let i = 0; i < path.length - 1; i++) {
            for (const branch of graph.branches()) {
              if (branch.from === path[i] && branch.to === path[i + 1]) {
                weight += branch.weight || 0;
                break;
              }
            }
          }
          return weight <= 8;
        })
      ).toBe(true);
    });

    it('should stop early when currentWeight already equals maxWeight', () => {
      // Test line 87: when currentWeight >= maxWeight before exploring neighbors
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b, 5); // Weight = 5, maxWeight = 5
      graph.addBranch(b, c, 1); // Would make total 6, but should stop at b

      const paths = findPathsWithConstraints(graph, a, c, { maxWeight: 5 });

      // Should not find any paths since a->b already equals maxWeight
      expect(paths.length).toBe(0);
    });

    it('should find paths with branchFilter', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(b, c, 3);
      graph.addBranch(a, c, 10);

      const paths = findPathsWithConstraints(graph, a, c, {
        branchFilter: branch => (branch.weight || 0) < 10,
      });

      expect(paths.length).toBeGreaterThan(0);
    });

    it('should find paths with leafFilter', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);
      graph.addBranch(a, c);

      const paths = findPathsWithConstraints(graph, a, c, {
        leafFilter: leaf => leaf.id !== 'b',
      });

      // Should only find direct path a->c
      expect(paths.some(path => path.length === 2 && path[0] === a && path[1] === c)).toBe(true);
    });

    it('should respect maxPaths constraint', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);
      graph.addBranch(a, c);

      const paths = findPathsWithConstraints(graph, a, c, { maxPaths: 1 });

      expect(paths.length).toBeLessThanOrEqual(1);
    });

    it('should return empty array if no path exists', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');

      const paths = findPathsWithConstraints(graph, a, b);

      expect(paths).toEqual([]);
    });
  });

  describe('findShortestPathWithConstraints', () => {
    it('should find shortest path with constraints', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(b, c, 3);
      graph.addBranch(a, c, 10);

      const path = findShortestPathWithConstraints(graph, a, c, { maxWeight: 20 });

      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toBe(a);
      expect(path[path.length - 1]).toBe(c);
    });

    it('should select shortest path when multiple paths exist', () => {
      // Test lines 157-158: when a shorter path is found
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      const d = graph.addLeaf('D', 'd');
      // Path 1: A -> B -> C (weight 5 + 3 = 8)
      graph.addBranch(a, b, 5);
      graph.addBranch(b, c, 3);
      // Path 2: A -> D -> C (weight 2 + 2 = 4) - shorter
      graph.addBranch(a, d, 2);
      graph.addBranch(d, c, 2);

      const path = findShortestPathWithConstraints(graph, a, c);

      // Should find the shorter path A -> D -> C (weight 4)
      expect(path.length).toBe(3);
      expect(path[0].id).toBe('a');
      expect(path[1].id).toBe('d'); // Should go through D, not B
      expect(path[2].id).toBe('c');
    });

    it('should return empty array if no path exists', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');

      const path = findShortestPathWithConstraints(graph, a, b);

      expect(path).toEqual([]);
    });
  });

  describe('findPathsAvoiding', () => {
    it('should find paths avoiding specific leaves', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);
      graph.addBranch(a, c);

      const paths = findPathsAvoiding(graph, a, c, [b]);

      expect(paths.length).toBeGreaterThan(0);
      expect(paths.every(path => !path.includes(b))).toBe(true);
    });

    it('should return empty array if all paths are blocked', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const paths = findPathsAvoiding(graph, a, c, [b]);

      expect(paths).toEqual([]);
    });
  });

  describe('findPathsThrough', () => {
    it('should find paths through required leaves', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);
      graph.addBranch(a, c);

      const paths = findPathsThrough(graph, a, c, [b]);

      expect(paths.length).toBeGreaterThan(0);
      expect(paths.every(path => path.includes(b))).toBe(true);
    });

    it('should return empty array if no path includes required leaves', () => {
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, c);

      const paths = findPathsThrough(graph, a, c, [b]);

      expect(paths).toEqual([]);
    });
  });
});
