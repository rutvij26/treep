import { Graph } from '../../src/core/Graph';
import { toDOT, toAdjacencyList, toEdgeList, toAdjacencyMatrix } from '../../src/utils/export';

describe('Export', () => {
  describe('toDOT', () => {
    it('should export empty graph to DOT', () => {
      const graph = new Graph<string>();
      const dot = toDOT(graph);

      expect(dot).toContain('digraph');
      expect(dot).toContain('G {');
      expect(dot).toContain('}');
    });

    it('should export graph with leaves to DOT', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');
      graph.addLeaf('B', 'b');

      const dot = toDOT(graph);

      expect(dot).toContain('"a"');
      expect(dot).toContain('"b"');
      expect(dot).toContain('label');
    });

    it('should export branches to DOT', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const dot = toDOT(graph);

      expect(dot).toContain('"a" -> "b"');
    });

    it('should include weights when specified', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const dot = toDOT(graph, { includeWeights: true });

      expect(dot).toContain('weight=5');
    });

    it('should exclude weights when specified', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const dot = toDOT(graph, { includeWeights: false });

      expect(dot).not.toContain('weight');
    });

    it('should export as undirected graph', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const dot = toDOT(graph, { directed: false });

      expect(dot).toContain('graph');
      expect(dot).toContain('"a" -- "b"');
    });

    it('should escape quotes in labels', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A "quoted" value', 'a');

      const dot = toDOT(graph);

      expect(dot).toContain('\\"');
    });
  });

  describe('toAdjacencyList', () => {
    it('should export to adjacency list', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const adjList = toAdjacencyList(graph);

      expect(adjList).toContain('a: b');
      expect(adjList).toContain('b:');
    });

    it('should include weights when specified', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const adjList = toAdjacencyList(graph, { includeWeights: true });

      expect(adjList).toContain('a: b:5');
    });

    it('should handle multiple neighbors', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(a, c);

      const adjList = toAdjacencyList(graph);

      expect(adjList).toMatch(/a: (b c|c b)/);
    });
  });

  describe('toEdgeList', () => {
    it('should export to edge list', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const edgeList = toEdgeList(graph);

      expect(edgeList).toContain('a b');
    });

    it('should include weights by default', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const edgeList = toEdgeList(graph);

      expect(edgeList).toContain('a b 5');
    });

    it('should exclude weights when specified', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const edgeList = toEdgeList(graph, { includeWeights: false });

      expect(edgeList).toContain('a b');
      expect(edgeList).not.toContain('5');
    });

    it('should handle multiple edges', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const edgeList = toEdgeList(graph);
      const lines = edgeList.split('\n');

      expect(lines).toHaveLength(2);
      expect(lines).toContain('a b');
      expect(lines).toContain('b c');
    });
  });

  describe('toAdjacencyMatrix', () => {
    it('should export to adjacency matrix', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const matrix = toAdjacencyMatrix(graph);

      expect(matrix).toHaveLength(2);
      expect(matrix[0]).toHaveLength(2);
      expect(matrix[1]).toHaveLength(2);
      expect(matrix[0][1]).toBe(1);
      expect(matrix[1][0]).toBe(0);
    });

    it('should include weights when specified', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const matrix = toAdjacencyMatrix(graph, { includeWeights: true });

      expect(matrix[0][1]).toBe(5);
    });

    it('should use 1 for unweighted edges when includeWeights is false', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const matrix = toAdjacencyMatrix(graph, { includeWeights: false });

      expect(matrix[0][1]).toBe(1);
    });

    it('should handle empty graph', () => {
      const graph = new Graph<string>();

      const matrix = toAdjacencyMatrix(graph);

      expect(matrix).toEqual([]);
    });

    it('should handle graph with multiple leaves', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const matrix = toAdjacencyMatrix(graph);

      expect(matrix).toHaveLength(3);
      expect(matrix[0][1]).toBe(1); // a -> b
      expect(matrix[1][2]).toBe(1); // b -> c
      expect(matrix[0][2]).toBe(0); // a -> c (no edge)
    });
  });
});
