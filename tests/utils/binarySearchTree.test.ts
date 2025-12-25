import { Graph } from '../../src/core/Graph';
import {
  bstInsert,
  bstSearch,
  bstMin,
  bstMax,
  bstSuccessor,
  bstPredecessor,
  bstDelete,
} from '../../src/utils/binarySearchTree';

describe('Binary Search Tree Operations', () => {
  let graph: Graph<number>;
  let root: any;

  beforeEach(() => {
    graph = new Graph<number>();
    root = graph.addLeaf(5, 'root');
  });

  // Suppress circular reference warnings in Jest
  const getNodeValue = (node: any) => node?.value;

  describe('bstInsert', () => {
    it('should insert value less than root to left', () => {
      const newNode = bstInsert(root, 3, graph);
      const children = root.getConnectedLeaves();
      expect(children.length).toBe(1);
      expect(getNodeValue(children[0])).toBe(3);
      expect(getNodeValue(newNode)).toBe(3);
    });

    it('should insert value greater than root to right', () => {
      const newNode = bstInsert(root, 7, graph);
      const children = root.getConnectedLeaves();
      expect(children.length).toBe(1);
      expect(getNodeValue(children[0])).toBe(7);
      expect(getNodeValue(newNode)).toBe(7);
    });

    it('should return existing node if value already exists', () => {
      bstInsert(root, 3, graph);
      const result = bstInsert(root, 3, graph);
      expect(getNodeValue(result)).toBe(3);
    });

    it('should build a valid BST', () => {
      bstInsert(root, 3, graph);
      bstInsert(root, 7, graph);
      bstInsert(root, 2, graph);
      bstInsert(root, 4, graph);

      const children = root.getConnectedLeaves();
      expect(children.length).toBe(2);
      expect(getNodeValue(children[0])).toBe(3); // Left child
      expect(getNodeValue(children[1])).toBe(7); // Right child
    });
  });

  describe('bstSearch', () => {
    beforeEach(() => {
      bstInsert(root, 3, graph);
      bstInsert(root, 7, graph);
      bstInsert(root, 2, graph);
      bstInsert(root, 4, graph);
    });

    it('should find existing value', () => {
      const found = bstSearch(root, 3);
      expect(found).not.toBeNull();
      expect(getNodeValue(found)).toBe(3);
    });

    it('should return null for non-existent value', () => {
      const found = bstSearch(root, 10);
      expect(found).toBeNull();
    });

    it('should find root value', () => {
      const found = bstSearch(root, 5);
      expect(found).toBe(root);
    });
  });

  describe('bstMin', () => {
    it('should find minimum value in BST', () => {
      bstInsert(root, 3, graph);
      bstInsert(root, 7, graph);
      bstInsert(root, 2, graph);
      bstInsert(root, 4, graph);

      const min = bstMin(root);
      expect(getNodeValue(min)).toBe(2);
    });

    it('should return root if it is minimum', () => {
      // Insert only values greater than root
      bstInsert(root, 7, graph);
      bstInsert(root, 8, graph);
      const min = bstMin(root);
      // Root (5) should be minimum since all inserted values are greater
      expect(getNodeValue(min)).toBe(5);
      expect(min.id).toBe(root.id);
    });
  });

  describe('bstMax', () => {
    it('should find maximum value in BST', () => {
      bstInsert(root, 3, graph);
      bstInsert(root, 7, graph);
      bstInsert(root, 2, graph);
      bstInsert(root, 4, graph);

      const max = bstMax(root);
      expect(getNodeValue(max)).toBe(7);
    });

    it('should return root if it is maximum', () => {
      bstInsert(root, 2, graph);
      bstInsert(root, 1, graph);
      const max = bstMax(root);
      expect(max).toBe(root);
    });
  });

  describe('bstSuccessor', () => {
    beforeEach(() => {
      bstInsert(root, 3, graph);
      bstInsert(root, 7, graph);
      bstInsert(root, 2, graph);
      bstInsert(root, 4, graph);
    });

    it('should find successor of a node', () => {
      const node3 = bstSearch(root, 3);
      expect(node3).not.toBeNull();
      if (node3) {
        const successor = bstSuccessor(node3, graph);
        expect(successor).not.toBeNull();
        expect(getNodeValue(successor)).toBe(4);
      }
    });

    it('should return null if no successor exists', () => {
      const max = bstMax(root);
      const successor = bstSuccessor(max, graph);
      expect(successor).toBeNull();
    });
  });

  describe('bstPredecessor', () => {
    beforeEach(() => {
      bstInsert(root, 3, graph);
      bstInsert(root, 7, graph);
      bstInsert(root, 2, graph);
      bstInsert(root, 4, graph);
    });

    it('should find predecessor of a node', () => {
      const node4 = bstSearch(root, 4);
      expect(node4).not.toBeNull();
      if (node4) {
        const predecessor = bstPredecessor(node4, graph);
        expect(predecessor).not.toBeNull();
        expect(getNodeValue(predecessor)).toBe(3);
      }
    });

    it('should return null if no predecessor exists', () => {
      const min = bstMin(root);
      const predecessor = bstPredecessor(min, graph);
      expect(predecessor).toBeNull();
    });
  });

  describe('bstDelete', () => {
    beforeEach(() => {
      bstInsert(root, 3, graph);
      bstInsert(root, 7, graph);
      bstInsert(root, 2, graph);
      bstInsert(root, 4, graph);
    });

    it('should delete leaf node', () => {
      const node2 = bstSearch(root, 2);
      expect(node2).not.toBeNull();
      if (node2) {
        const result = bstDelete(node2, graph);
        expect(result).toBe(true);
        expect(bstSearch(root, 2)).toBeNull();
      }
    });

    it('should delete node with one child', () => {
      // Create a node with one child
      bstInsert(root, 1, graph);
      const node2 = bstSearch(root, 2);
      expect(node2).not.toBeNull();
      if (node2) {
        const result = bstDelete(node2, graph);
        expect(result).toBe(true);
      }
    });

    it('should delete node with two children', () => {
      const node3 = bstSearch(root, 3);
      expect(node3).not.toBeNull();
      if (node3) {
        const result = bstDelete(node3, graph);
        expect(result).toBe(true);
        expect(bstSearch(root, 3)).toBeNull();
      }
    });

    it('should handle deletion of node with one child', () => {
      // Create a simple BST with one child
      bstInsert(root, 3, graph);
      const node3 = bstSearch(root, 3);
      expect(node3).not.toBeNull();
      if (node3) {
        const result = bstDelete(node3, graph);
        expect(result).toBe(true);
      }
    });
  });
});
