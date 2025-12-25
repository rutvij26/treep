import { renderASCII } from '../../src/utils/renderASCII';
import { Graph } from '../../src/core/Graph';

describe('renderASCII', () => {
  it('should render empty graph', () => {
    const graph = new Graph<{ name: string }>();
    const result = renderASCII(graph);
    expect(result).toContain('empty');
  });

  it('should render graph with single leaf', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const result = renderASCII(graph, alice);
    expect(result).toContain('Alice');
  });

  it('should render graph with branches', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
    graph.addBranch(alice, bob);

    const result = renderASCII(graph, alice);
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
  });

  it('should show weights when specified', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const bob = graph.addLeaf({ name: 'Bob' }, 'bob');
    graph.addBranch(alice, bob, 5);

    const result = renderASCII(graph, alice, { showWeights: true });
    expect(result).toContain('w:5');
  });

  it('should show IDs when specified', () => {
    const graph = new Graph<{ name: string }>();
    const alice = graph.addLeaf({ name: 'Alice' }, 'alice');
    const result = renderASCII(graph, alice, { showIds: true });
    expect(result).toContain('alice');
  });

  it('should respect maxDepth option', () => {
    const graph = new Graph<{ name: string }>();
    const a = graph.addLeaf({ name: 'A' }, 'a');
    const b = graph.addLeaf({ name: 'B' }, 'b');
    const c = graph.addLeaf({ name: 'C' }, 'c');
    graph.addBranch(a, b);
    graph.addBranch(b, c);

    const result = renderASCII(graph, a, { maxDepth: 1 });
    // Should not include C due to depth limit
    expect(result).not.toContain('C');
  });
});

