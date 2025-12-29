import { Graph } from '../../src/core';
import { fromJSONStream, toJSONStream, toAsyncStream } from '../../src/utils/streaming';

describe('Streaming', () => {
  describe('fromJSONStream', () => {
    it('should parse JSON array and build graph', () => {
      const json = JSON.stringify([
        { id: 'a', value: 'A', branches: [{ to: 'b' }] },
        { id: 'b', value: 'B', branches: [] },
      ]);

      const graph = fromJSONStream(json);

      expect(graph.size()).toBe(2);
      expect(graph.getLeaf('a')?.value).toBe('A');
      expect(graph.getLeaf('b')?.value).toBe('B');
    });

    it('should call onLeaf callback', () => {
      const json = JSON.stringify([{ id: 'a', value: 'A', branches: [] }]);
      const leaves: string[] = [];

      fromJSONStream(json, {
        onLeaf: leaf => {
          leaves.push(leaf.id.toString());
        },
      });

      expect(leaves).toContain('a');
    });

    it('should handle custom field names', () => {
      const json = JSON.stringify([
        { nodeId: 'a', data: 'A', edges: [{ target: 'b' }] },
        { nodeId: 'b', data: 'B', edges: [] },
      ]);

      const graph = fromJSONStream(json, {
        idField: 'nodeId',
        valueField: 'data',
        branchesField: 'edges',
        weightField: 'weight',
      });

      expect(graph.size()).toBe(2);
      expect(graph.getLeaf('a')?.value).toBe('A');
    });
  });

  describe('toJSONStream', () => {
    it('should stream graph to JSON chunks', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const chunks: string[] = [];
      for (const chunk of toJSONStream(graph)) {
        chunks.push(chunk);
      }

      const json = chunks.join('');
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
    });

    it('should handle empty graph', () => {
      const graph = new Graph<string>();
      const chunks: string[] = [];
      for (const chunk of toJSONStream(graph)) {
        chunks.push(chunk);
      }

      const json = chunks.join('');
      const parsed = JSON.parse(json);
      expect(parsed).toEqual([]);
    });

    it('should respect includeWeights option', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const chunks: string[] = [];
      for (const chunk of toJSONStream(graph, { includeWeights: true })) {
        chunks.push(chunk);
      }

      const json = chunks.join('');
      expect(json).toContain('weight');
    });

    it('should handle includeIds false', () => {
      // Test line 214: when includeIds is false but includeWeights is true
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const chunks: string[] = [];
      for (const chunk of toJSONStream(graph, { includeIds: false, includeWeights: true })) {
        chunks.push(chunk);
      }

      const json = chunks.join('');
      expect(json).toContain('weight');
      expect(json).not.toContain('"id"');
    });

    it('should handle multiple branches with comma separator', () => {
      // Test line 204: comma separator for multiple branches
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      const c = graph.addLeaf('C', 'c');
      graph.addBranch(a, b);
      graph.addBranch(a, c);

      const chunks: string[] = [];
      for (const chunk of toJSONStream(graph)) {
        chunks.push(chunk);
      }

      const json = chunks.join('');
      expect(json).toContain(',');
    });
  });

  describe('fromJSONStream edge cases', () => {
    it('should throw error for invalid JSON type', () => {
      // Test line 69: throw when JSON is not object or array
      expect(() => {
        fromJSONStream('"string"'); // String is not object or array
      }).toThrow('JSON must be an object or array');

      expect(() => {
        fromJSONStream('123'); // Number is not object or array
      }).toThrow('JSON must be an object or array');
    });

    it('should skip non-object items', () => {
      // Test line 78: continue when item is not object
      const json = JSON.stringify(['string', 123, null, { id: 'a', value: 'A', branches: [] }]);
      const graph = fromJSONStream(json);
      expect(graph.size()).toBe(1);
    });

    it('should skip when fromLeaf is not found in second pass (line 118)', () => {
      // Test line 118: when fromLeaf is not found in the second pass
      // This can happen if the first pass created a leaf but it was removed or the ID doesn't match
      const json = JSON.stringify([
        { id: 'a', value: 'A', branches: [{ to: 'b' }] },
        // Note: 'b' is referenced but not created in first pass
        { id: 'c', value: 'C', branches: [] },
      ]);
      const graph = fromJSONStream(json);
      // Should only have 'a' and 'c', not 'b'
      expect(graph.size()).toBe(2);
      expect(graph.getLeaf('a')).toBeDefined();
      expect(graph.getLeaf('c')).toBeDefined();
      expect(graph.getLeaf('b')).toBeUndefined();
    });

    it('should skip items without id field', () => {
      // Test line 86: continue when id is undefined
      const json = JSON.stringify([
        { value: 'A', branches: [] },
        { id: 'b', value: 'B', branches: [] },
      ]);
      const graph = fromJSONStream(json);
      expect(graph.size()).toBe(1);
      expect(graph.getLeaf('b')).toBeDefined();
    });

    it('should skip items that are not objects in second pass', () => {
      // Test line 105: continue when item is not object in second pass
      const json = JSON.stringify([{ id: 'a', value: 'A', branches: ['string'] }]);
      const graph = fromJSONStream(json);
      expect(graph.size()).toBe(1);
    });

    it('should skip when fromId is undefined', () => {
      // Test line 113: continue when fromId is undefined
      const json = JSON.stringify([{ value: 'A', branches: [{ to: 'b' }] }]);
      const graph = fromJSONStream(json);
      expect(graph.size()).toBe(0);
    });

    it('should skip when fromLeaf is not found (line 118)', () => {
      // Test line 118: continue when fromLeaf is not found in second pass
      // This happens when an item in the second pass has a fromId that doesn't exist
      // (e.g., the first pass skipped creating the leaf due to missing/invalid id)
      const json = JSON.stringify([
        // Item without id field - won't create leaf in first pass
        { value: 'A', branches: [{ to: 'b' }] },
        // This item has id 'missing', but 'missing' was never created in first pass
        // because the first item had no id field
        { id: 'b', value: 'B', branches: [] },
      ]);
      const graph = fromJSONStream(json);
      // Should only have 'b', the first item was skipped
      expect(graph.size()).toBe(1);
      expect(graph.getLeaf('b')).toBeDefined();
    });

    it('should call onBranch callback', () => {
      // Test lines 137-147: onBranch callback
      const json = JSON.stringify([
        { id: 'a', value: 'A', branches: [{ to: 'b' }] },
        { id: 'b', value: 'B', branches: [] },
      ]);
      const branches: string[] = [];
      fromJSONStream(json, {
        onBranch: branch => {
          branches.push(branch.from.id.toString());
        },
      });
      expect(branches.length).toBeGreaterThan(0);
    });

    it('should call onBranch callback for simple ID references', () => {
      // Test line 147: onBranch callback for simple ID reference branches
      const json = JSON.stringify([
        { id: 'a', value: 'A', branches: ['b'] },
        { id: 'b', value: 'B', branches: [] },
      ]);
      const branches: string[] = [];
      fromJSONStream(json, {
        onBranch: branch => {
          branches.push(branch.to.id.toString());
        },
      });
      expect(branches).toContain('b');
    });

    it('should handle simple ID references in branches', () => {
      // Test lines 141-149: simple ID reference (string/number)
      const json = JSON.stringify([
        { id: 'a', value: 'A', branches: ['b'] },
        { id: 'b', value: 'B', branches: [] },
      ]);
      const graph = fromJSONStream(json);
      expect(graph.size()).toBe(2);
      expect(graph.getLeaf('a')?.branches.length).toBe(1);
    });

    it('should call onBranch callback for simple ID reference branches', () => {
      // Test line 147: onBranch callback for simple ID reference branches
      const json = JSON.stringify([
        { id: 'a', value: 'A', branches: ['b'] },
        { id: 'b', value: 'B', branches: [] },
      ]);
      const branches: string[] = [];
      fromJSONStream(json, {
        onBranch: branch => {
          branches.push(branch.to.id.toString());
        },
      });
      expect(branches).toContain('b');
    });
  });

  describe('toAsyncStream', () => {
    it('should convert generator to async stream', async () => {
      // Test lines 232-240: toAsyncStream
      function* testGenerator() {
        yield 1;
        yield 2;
        yield 3;
      }

      const results: number[] = [];
      for await (const value of toAsyncStream(testGenerator())) {
        results.push(value);
      }

      expect(results).toEqual([1, 2, 3]);
    });
  });
});
