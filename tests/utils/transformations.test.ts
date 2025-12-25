import { Graph } from '../../src/core/Graph';
import {
  reverseGraph,
  toUndirected,
  transpose,
  filterBranches,
  filterLeaves,
} from '../../src/utils/transformations';

describe('Transformations', () => {
  describe('reverseGraph', () => {
    it('should reverse all branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const reversed = reverseGraph(graph);

      expect(reversed.hasBranch(reversed.getLeaf('b')!, reversed.getLeaf('a')!)).toBe(true);
      expect(reversed.hasBranch(reversed.getLeaf('a')!, reversed.getLeaf('b')!)).toBe(false);
    });

    it('should preserve leaf values', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');
      graph.addLeaf('B', 'b');

      const reversed = reverseGraph(graph);

      expect(reversed.getLeaf('a')?.value).toBe('A');
      expect(reversed.getLeaf('b')?.value).toBe('B');
    });

    it('should preserve branch weights', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const reversed = reverseGraph(graph);
      const branch = reversed.branches().find(
        (br) => br.from.id === 'b' && br.to.id === 'a'
      );

      expect(branch?.weight).toBe(5);
    });

    it('should handle empty graph', () => {
      const graph = new Graph<string>();

      const reversed = reverseGraph(graph);

      expect(reversed.size()).toBe(0);
    });
  });

  describe('toUndirected', () => {
    it('should create bidirectional branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const undirected = toUndirected(graph);

      expect(undirected.hasBranch(undirected.getLeaf('a')!, undirected.getLeaf('b')!)).toBe(true);
      expect(undirected.hasBranch(undirected.getLeaf('b')!, undirected.getLeaf('a')!)).toBe(true);
    });

    it('should preserve weights', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const undirected = toUndirected(graph);
      const branches = undirected.branches();

      expect(branches.every((br) => br.weight === 5)).toBe(true);
    });

    it('should handle multiple branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const undirected = toUndirected(graph);

      expect(undirected.branchCount()).toBe(4); // 2 original * 2 directions
    });

    it('should handle empty graph', () => {
      const graph = new Graph<string>();

      const undirected = toUndirected(graph);

      expect(undirected.size()).toBe(0);
    });
  });

  describe('transpose', () => {
    it('should transpose graph (same as reverse)', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const transposed = transpose(graph);

      expect(transposed.hasBranch(transposed.getLeaf('b')!, transposed.getLeaf('a')!)).toBe(true);
    });
  });

  describe('filterBranches', () => {
    it('should filter branches by predicate', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(b, c, 3);

      const filtered = filterBranches(graph, (branch) => (branch.weight || 0) > 4);

      expect(filtered.branchCount()).toBe(1);
      expect(filtered.hasBranch(filtered.getLeaf('a')!, filtered.getLeaf('b')!)).toBe(true);
    });

    it('should only include leaves connected by filtered branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const filtered = filterBranches(graph, () => false);

      expect(filtered.size()).toBe(0);
    });
  });

  describe('filterLeaves', () => {
    it('should filter leaves by predicate', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');
      graph.addLeaf('B', 'b');
      graph.addLeaf('C', 'c');

      const filtered = filterLeaves(graph, (leaf) => leaf.id === 'a' || leaf.id === 'b');

      expect(filtered.size()).toBe(2);
      expect(filtered.hasLeaf('a')).toBe(true);
      expect(filtered.hasLeaf('b')).toBe(true);
      expect(filtered.hasLeaf('c')).toBe(false);
    });

    it('should include branches between filtered leaves', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const filtered = filterLeaves(graph, (leaf) => leaf.id === 'a' || leaf.id === 'b');

      expect(filtered.branchCount()).toBe(1);
      expect(filtered.hasBranch(filtered.getLeaf('a')!, filtered.getLeaf('b')!)).toBe(true);
    });

    it('should exclude branches to filtered-out leaves', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const filtered = filterLeaves(graph, (leaf) => leaf.id === 'a' || leaf.id === 'b');

      expect(filtered.branchCount()).toBe(1);
      expect(filtered.hasBranch(filtered.getLeaf('a')!, filtered.getLeaf('b')!)).toBe(true);
    });
  });
});

