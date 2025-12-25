import { Graph } from '../../src/core/Graph';
import { getStatistics } from '../../src/utils/statistics';

describe('Statistics', () => {
  describe('getStatistics', () => {
    it('should return statistics for empty graph', () => {
      const graph = new Graph<string>();
      const stats = getStatistics(graph);

      expect(stats.leafCount).toBe(0);
      expect(stats.branchCount).toBe(0);
      expect(stats.density).toBe(0);
      expect(stats.averageDegree).toBe(0);
      expect(stats.maxDegree).toBe(0);
      expect(stats.minDegree).toBe(0);
      expect(stats.isolatedLeaves).toBe(0);
      expect(stats.isEmpty).toBe(true);
      expect(stats.hasBranches).toBe(false);
    });

    it('should calculate statistics for single leaf', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');

      const stats = getStatistics(graph);

      expect(stats.leafCount).toBe(1);
      expect(stats.branchCount).toBe(0);
      expect(stats.density).toBe(0);
      expect(stats.isolatedLeaves).toBe(1);
      expect(stats.isEmpty).toBe(false);
    });

    it('should calculate statistics for graph with branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const stats = getStatistics(graph);

      expect(stats.leafCount).toBe(3);
      expect(stats.branchCount).toBe(2);
      expect(stats.density).toBeCloseTo(2 / 6, 5); // 2 branches / (3 * 2) for directed
      expect(stats.averageDegree).toBeCloseTo(2 / 3, 5);
      expect(stats.maxDegree).toBe(2); // a has 2 outgoing branches (to b and c)
      expect(stats.minDegree).toBe(0);
      expect(stats.isolatedLeaves).toBe(0); // all leaves have at least one connection
    });

    it('should calculate weighted statistics', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);
      graph.addBranch(b, a, 3);

      const stats = getStatistics(graph);

      expect(stats.totalWeight).toBe(8);
      expect(stats.averageWeight).toBe(4);
    });

    it('should handle mixed weighted and unweighted branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(b, c); // unweighted

      const stats = getStatistics(graph);

      expect(stats.totalWeight).toBe(5);
      expect(stats.averageWeight).toBe(5);
    });

    it('should calculate statistics for undirected graph', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const stats = getStatistics(graph, false);

      expect(stats.leafCount).toBe(2);
      expect(stats.branchCount).toBe(1);
      // For undirected: max branches = n*(n-1)/2 = 2*1/2 = 1
      expect(stats.density).toBe(1);
    });

    it('should calculate max and min degree correctly', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(a, c);
      graph.addBranch(b, c);

      const stats = getStatistics(graph);

      expect(stats.maxDegree).toBe(2); // a has 2 outgoing
      expect(stats.minDegree).toBe(0); // c has 0 outgoing
    });

    it('should handle complete graph', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(a, c);
      graph.addBranch(b, a);
      graph.addBranch(b, c);
      graph.addBranch(c, a);
      graph.addBranch(c, b);

      const stats = getStatistics(graph);

      expect(stats.leafCount).toBe(3);
      expect(stats.branchCount).toBe(6);
      expect(stats.density).toBe(1); // Complete directed graph
      expect(stats.isolatedLeaves).toBe(0);
    });
  });
});
