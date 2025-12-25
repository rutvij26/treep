import { mergeGraph } from '../../src/utils/mergeGraph';
import { Graph } from '../../src/core/Graph';

describe('mergeGraph', () => {
  it('should merge two graphs', () => {
    const graph1 = new Graph<{ name: string }>();
    const alice = graph1.addLeaf({ name: 'Alice' }, 'alice');
    const bob = graph1.addLeaf({ name: 'Bob' }, 'bob');
    graph1.addBranch(alice, bob);

    const graph2 = new Graph<{ name: string }>();
    const charlie = graph2.addLeaf({ name: 'Charlie' }, 'charlie');
    const diana = graph2.addLeaf({ name: 'Diana' }, 'diana');
    graph2.addBranch(charlie, diana);

    mergeGraph(graph1, graph2);
    expect(graph1.size()).toBe(4);
  });

  it('should skip duplicate leaves by default', () => {
    const graph1 = new Graph<{ name: string }>();
    graph1.addLeaf({ name: 'Alice' }, 'alice');

    const graph2 = new Graph<{ name: string }>();
    graph2.addLeaf({ name: 'Alice Updated' }, 'alice');

    mergeGraph(graph1, graph2, { onIdConflict: 'skip' });
    const leaf = graph1.getLeaf('alice');
    expect(leaf?.value.name).toBe('Alice'); // Original value preserved
  });

  it('should overwrite duplicate leaves when specified', () => {
    const graph1 = new Graph<{ name: string }>();
    graph1.addLeaf({ name: 'Alice' }, 'alice');

    const graph2 = new Graph<{ name: string }>();
    graph2.addLeaf({ name: 'Alice Updated' }, 'alice');

    mergeGraph(graph1, graph2, { onIdConflict: 'overwrite' });
    const leaf = graph1.getLeaf('alice');
    expect(leaf?.value.name).toBe('Alice Updated');
  });

  it('should throw error on conflict when specified', () => {
    const graph1 = new Graph<{ name: string }>();
    graph1.addLeaf({ name: 'Alice' }, 'alice');

    const graph2 = new Graph<{ name: string }>();
    graph2.addLeaf({ name: 'Alice Updated' }, 'alice');

    expect(() => {
      mergeGraph(graph1, graph2, { onIdConflict: 'throw' });
    }).toThrow();
  });

  it('should merge branches when mergeBranches is true', () => {
    const graph1 = new Graph<{ name: string }>();
    const alice = graph1.addLeaf({ name: 'Alice' }, 'alice');
    const bob = graph1.addLeaf({ name: 'Bob' }, 'bob');

    const graph2 = new Graph<{ name: string }>();
    const alice2 = graph2.addLeaf({ name: 'Alice' }, 'alice');
    const charlie = graph2.addLeaf({ name: 'Charlie' }, 'charlie');
    graph2.addBranch(alice2, charlie);

    mergeGraph(graph1, graph2, { mergeBranches: true });
    expect(graph1.branchCount()).toBeGreaterThan(0);
  });
});

