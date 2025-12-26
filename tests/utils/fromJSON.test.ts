import { fromJSON } from '../../src/utils/fromJSON';
import { Graph } from '../../src/core/Graph';

describe('fromJSON', () => {
  it('should build graph from array of items', () => {
    const data = [
      { id: 1, name: 'Alice', friends: [2] },
      { id: 2, name: 'Bob', friends: [1] },
    ];

    const graph = fromJSON(data, {
      idField: 'id',
      branchField: 'friends',
    });

    expect(graph.size()).toBe(2);
    expect(graph.branchCount()).toBeGreaterThan(0);
  });

  it('should throw error if idField is missing', () => {
    const data = [{ name: 'Alice', friends: [] }];
    expect(() => {
      fromJSON(data, { idField: 'id', branchField: 'friends' });
    }).toThrow();
  });

  it('should handle nested object structure', () => {
    const data = {
      id: 1,
      name: 'Root',
      children: [
        { id: 2, name: 'Child 1', children: [] },
        { id: 3, name: 'Child 2', children: [] },
      ],
    };

    const graph = fromJSON(data, {
      idField: 'id',
      branchField: 'children',
    });

    expect(graph.size()).toBeGreaterThan(0);
  });

  it('should throw error for invalid data type', () => {
    expect(() => {
      fromJSON('invalid', {});
    }).toThrow();
  });

  it('should skip non-object items in array (line 33)', () => {
    const data = [
      { id: 1, name: 'Alice', friends: [] },
      'invalid string',
      null,
      123,
      { id: 2, name: 'Bob', friends: [1] },
    ];

    const graph = fromJSON(data, {
      idField: 'id',
      branchField: 'friends',
    });

    expect(graph.size()).toBe(2);
  });

  it('should skip non-object items in second pass (line 50)', () => {
    const data = [
      { id: 1, name: 'Alice', friends: [2] },
      'invalid',
      null,
      { id: 2, name: 'Bob', friends: [] },
    ];

    const graph = fromJSON(data, {
      idField: 'id',
      branchField: 'friends',
    });

    expect(graph.size()).toBe(2);
    expect(graph.hasBranch(graph.getLeaf(1)!, graph.getLeaf(2)!)).toBe(true);
  });

  it('should skip when fromLeaf is not found (line 57)', () => {
    const data = [
      { id: 1, name: 'Alice', friends: [2] },
      // Missing id: 2, but referenced in friends
    ];

    const graph = fromJSON(data, {
      idField: 'id',
      branchField: 'friends',
    });

    // Should only have one leaf since id: 2 was never created
    expect(graph.size()).toBe(1);
  });
});
