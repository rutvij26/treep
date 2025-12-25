import { Graph } from '../../src/core/Graph';
import { extractSubgraph, extractReachableSubgraph } from '../../src/utils/subgraph';

describe('Subgraph', () => {
  describe('extractSubgraph', () => {
    it('should extract subgraph with specified leaves', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const subgraph = extractSubgraph(graph, ['a', 'b']);

      expect(subgraph.size()).toBe(2);
      expect(subgraph.hasLeaf('a')).toBe(true);
      expect(subgraph.hasLeaf('b')).toBe(true);
      expect(subgraph.hasLeaf('c')).toBe(false);
    });

    it('should include branches between selected leaves', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b, 5);
      graph.addBranch(b, c, 3);

      const subgraph = extractSubgraph(graph, ['a', 'b']);

      expect(subgraph.branchCount()).toBe(1);
      const branches = subgraph.branches();
      expect(branches[0].from.id).toBe('a');
      expect(branches[0].to.id).toBe('b');
      expect(branches[0].weight).toBe(5);
    });

    it('should exclude branches to external leaves by default', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const subgraph = extractSubgraph(graph, ['a', 'b']);

      expect(subgraph.branchCount()).toBe(1);
      expect(subgraph.hasBranch(subgraph.getLeaf('a')!, subgraph.getLeaf('b')!)).toBe(true);
    });

    it('should include external branches when option is set', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const subgraph = extractSubgraph(graph, ['a', 'b'], { includeExternalBranches: true });

      // Should still only have 1 branch (a->b) since c is not in subgraph
      expect(subgraph.branchCount()).toBe(1);
    });

    it('should exclude branches when includeBranches is false', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const subgraph = extractSubgraph(graph, ['a', 'b'], { includeBranches: false });

      expect(subgraph.branchCount()).toBe(0);
    });

    it('should handle non-existent leaf IDs', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');
      graph.addLeaf('B', 'b');

      const subgraph = extractSubgraph(graph, ['a', 'nonexistent']);

      expect(subgraph.size()).toBe(1);
      expect(subgraph.hasLeaf('a')).toBe(true);
    });

    it('should preserve leaf values', () => {
      const graph = new Graph<{ name: string }>();
      graph.addLeaf({ name: 'Alice' }, 'a');
      graph.addLeaf({ name: 'Bob' }, 'b');

      const subgraph = extractSubgraph(graph, ['a']);

      expect(subgraph.getLeaf('a')?.value).toEqual({ name: 'Alice' });
    });
  });

  describe('extractReachableSubgraph', () => {
    it('should extract all reachable leaves from start', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const subgraph = extractReachableSubgraph(graph, 'a');

      expect(subgraph.size()).toBe(3);
      expect(subgraph.hasLeaf('a')).toBe(true);
      expect(subgraph.hasLeaf('b')).toBe(true);
      expect(subgraph.hasLeaf('c')).toBe(true);
    });

    it('should respect maxDepth', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(b, c);

      const subgraph = extractReachableSubgraph(graph, 'a', 1);

      expect(subgraph.size()).toBe(2);
      expect(subgraph.hasLeaf('a')).toBe(true);
      expect(subgraph.hasLeaf('b')).toBe(true);
      expect(subgraph.hasLeaf('c')).toBe(false);
    });

    it('should return empty graph for non-existent start leaf', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');

      const subgraph = extractReachableSubgraph(graph, 'nonexistent');

      expect(subgraph.size()).toBe(0);
    });

    it('should handle single leaf', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');

      const subgraph = extractReachableSubgraph(graph, 'a');

      expect(subgraph.size()).toBe(1);
      expect(subgraph.hasLeaf('a')).toBe(true);
    });

    it('should not traverse backwards', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(c, b); // c -> b, but we start from a

      const subgraph = extractReachableSubgraph(graph, 'a');

      expect(subgraph.size()).toBe(2);
      expect(subgraph.hasLeaf('a')).toBe(true);
      expect(subgraph.hasLeaf('b')).toBe(true);
      expect(subgraph.hasLeaf('c')).toBe(false);
    });

    it('should include branches in reachable subgraph', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const subgraph = extractReachableSubgraph(graph, 'a');

      expect(subgraph.branchCount()).toBe(1);
      const branch = subgraph.branches()[0];
      expect(branch.from.id).toBe('a');
      expect(branch.to.id).toBe('b');
      expect(branch.weight).toBe(5);
    });
  });
});
