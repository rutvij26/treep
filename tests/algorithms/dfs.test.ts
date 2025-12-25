import { Graph } from '../../src/core/Graph';
import { DFS } from '../../src/algorithms/dfs';

describe('DFS', () => {
  it('should traverse graph in depth-first order', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);

    const visited = DFS(a);
    const names = visited.map(leaf => leaf.value.name);

    expect(names[0]).toBe('A');
    expect(names).toContain('B');
    expect(names).toContain('C');
    expect(names).toContain('D');
    expect(names.length).toBe(4);
  });

  it('should call visit callback for each leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const visited: string[] = [];
    DFS(a, leaf => {
      visited.push(leaf.value.name);
    });

    expect(visited).toContain('A');
    expect(visited).toContain('B');
  });

  it('should handle single leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');

    const visited = DFS(a);
    expect(visited).toHaveLength(1);
    expect(visited[0].value.name).toBe('A');
  });

  it('should skip already visited nodes when popped from stack', () => {
    // Create a graph where a node can be reached via multiple paths
    // This tests the defensive check at line 18-19
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    // A -> B, A -> C, B -> D, C -> D
    // D can be reached via both B and C
    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);
    graph.addBranch(c, d);
    graph.addBranch(d, b); // Creates cycle back to B

    const visited = DFS(a);
    const names = visited.map(leaf => leaf.value.name);

    // Should visit each node only once despite multiple paths
    expect(names.length).toBe(4);
    expect(new Set(names).size).toBe(4); // All unique
  });
});
