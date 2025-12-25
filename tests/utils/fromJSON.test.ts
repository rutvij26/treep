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
});

