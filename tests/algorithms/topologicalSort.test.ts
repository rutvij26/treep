import { Graph } from '../../src/core/Graph';
import { topologicalSort, isDAG } from '../../src/algorithms/topologicalSort';
import { GraphError } from '../../src/errors/GraphError';

describe('Topological Sort', () => {
  describe('topologicalSort', () => {
    it('should sort simple DAG', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const sorted = topologicalSort(graph);

      expect(sorted).toHaveLength(3);
      expect(sorted[0]).toBe(a);
      expect(sorted[1]).toBe(b);
      expect(sorted[2]).toBe(c);
    });

    it('should handle single leaf', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');

      const sorted = topologicalSort(graph);

      expect(sorted).toEqual([a]);
    });

    it('should handle empty graph', () => {
      const graph = new Graph<string>();

      const sorted = topologicalSort(graph);

      expect(sorted).toEqual([]);
    });

    it('should handle multiple roots', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, c);
      graph.addBranch(b, c);

      const sorted = topologicalSort(graph);

      expect(sorted).toHaveLength(3);
      expect(sorted).toContain(a);
      expect(sorted).toContain(b);
      expect(sorted[2]).toBe(c); // c should be last
    });

    it('should throw error for graph with cycle', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);
      graph.addBranch(b, a);

      expect(() => topologicalSort(graph)).toThrow(GraphError);
      try {
        topologicalSort(graph);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(GraphError);
        if (error instanceof GraphError) {
          expect(error.code).toBe('CYCLE_DETECTED');
        }
      }
    });

    it('should handle complex DAG', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      const d = graph.addLeaf('D', 'd');
      graph.addBranch(a, b);
      graph.addBranch(a, c);
      graph.addBranch(b, d);
      graph.addBranch(c, d);

      const sorted = topologicalSort(graph);

      expect(sorted).toHaveLength(4);
      expect(sorted[0]).toBe(a);
      expect(sorted).toContain(b);
      expect(sorted).toContain(c);
      expect(sorted[3]).toBe(d);
    });
  });

  describe('isDAG', () => {
    it('should return true for acyclic graph', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      expect(isDAG(graph)).toBe(true);
    });

    it('should return false for graph with cycle', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);
      graph.addBranch(b, a);

      expect(isDAG(graph)).toBe(false);
    });

    it('should return true for empty graph', () => {
      const graph = new Graph<string>();

      expect(isDAG(graph)).toBe(true);
    });

    it('should return true for single leaf', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');

      expect(isDAG(graph)).toBe(true);
    });
  });
});

