import { Graph } from '../../src/core/Graph';
import { toJSON, toJSONString } from '../../src/utils/serialization';

describe('Serialization', () => {
  describe('toJSON', () => {
    it('should serialize empty graph', () => {
      const graph = new Graph<string>();
      const result = toJSON(graph);

      expect(result.nodes).toEqual([]);
      expect(result.edges).toEqual([]);
    });

    it('should serialize graph with leaves only', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');
      graph.addLeaf('B', 'b');

      const result = toJSON(graph);

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes).toContainEqual({ id: 'a', value: 'A' });
      expect(result.nodes).toContainEqual({ id: 'b', value: 'B' });
      expect(result.edges).toEqual([]);
    });

    it('should serialize graph with branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const result = toJSON(graph);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      expect(result.edges[0]).toEqual({ from: 'a', to: 'b', weight: 5 });
    });

    it('should exclude weights when includeWeights is false', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const result = toJSON(graph, { includeWeights: false });

      expect(result.edges[0]).not.toHaveProperty('weight');
      expect(result.edges[0]).toEqual({ from: 'a', to: 'b' });
    });

    it('should exclude IDs when includeIds is false', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');
      graph.addLeaf('B', 'b');

      const result = toJSON(graph, { includeIds: false });

      expect(result.nodes[0]).not.toHaveProperty('id');
      expect(result.nodes[0]).toEqual({ value: 'A' });
    });

    it('should use custom field names', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b, 5);

      const result = toJSON(graph, {
        fieldNames: {
          id: 'nodeId',
          value: 'data',
          from: 'source',
          to: 'target',
          weight: 'cost',
          nodes: 'vertices',
          edges: 'connections',
        },
      });

      expect(result).toHaveProperty('vertices');
      expect(result).toHaveProperty('connections');
      expect(result.vertices[0]).toHaveProperty('nodeId');
      expect(result.vertices[0]).toHaveProperty('data');
      expect(result.connections[0]).toHaveProperty('source');
      expect(result.connections[0]).toHaveProperty('target');
      expect(result.connections[0]).toHaveProperty('cost');
    });

    it('should serialize complex value types', () => {
      const graph = new Graph<{ name: string; age: number }>();
      graph.addLeaf({ name: 'Alice', age: 30 }, 'a');
      graph.addLeaf({ name: 'Bob', age: 25 }, 'b');

      const result = toJSON(graph);

      expect(result.nodes[0].value).toEqual({ name: 'Alice', age: 30 });
      expect(result.nodes[1].value).toEqual({ name: 'Bob', age: 25 });
    });

    it('should handle unweighted branches', () => {
      const graph = new Graph<string>();
      const a = graph.addLeaf('A', 'a');
      const b = graph.addLeaf('B', 'b');
      graph.addBranch(a, b);

      const result = toJSON(graph);

      expect(result.edges[0]).toEqual({ from: 'a', to: 'b' });
    });
  });

  describe('toJSONString', () => {
    it('should serialize to JSON string', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');
      graph.addLeaf('B', 'b');

      const result = toJSONString(graph);
      const parsed = JSON.parse(result);

      expect(parsed.nodes).toHaveLength(2);
      expect(parsed.edges).toEqual([]);
    });

    it('should use custom indentation', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');

      const result = toJSONString(graph, {}, 4);
      const lines = result.split('\n');

      expect(lines[1]).toMatch(/^    /); // 4 spaces indentation
    });

    it('should produce compact JSON with 0 indent', () => {
      const graph = new Graph<string>();
      graph.addLeaf('A', 'a');

      const result = toJSONString(graph, {}, 0);
      expect(result).not.toContain('\n');
    });
  });
});
