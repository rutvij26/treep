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
    const names = visited.map((leaf) => leaf.value.name);

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
    DFS(a, (leaf) => {
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
});

