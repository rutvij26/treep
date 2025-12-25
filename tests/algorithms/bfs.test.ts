import { Graph } from '../../src/core/Graph';
import { BFS } from '../../src/algorithms/bfs';

describe('BFS', () => {
  it('should traverse graph in breadth-first order', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    const d = graph.addLeaf({ name: 'D' }, 'd');

    graph.addBranch(a, b);
    graph.addBranch(a, c);
    graph.addBranch(b, d);

    const visited = BFS(a);
    const names = visited.map(leaf => leaf.value.name);

    expect(names).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should call visit callback for each leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    graph.addBranch(a, b);

    const visited: string[] = [];
    BFS(a, leaf => {
      visited.push(leaf.value.name);
    });

    expect(visited).toEqual(['A', 'B']);
  });

  it('should handle single leaf', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');

    const visited = BFS(a);
    expect(visited).toHaveLength(1);
    expect(visited[0].value.name).toBe('A');
  });
});
