import { Graph } from '../../src/core/Graph';
import {
  isTree,
  isBST,
  isBalanced,
  isComplete,
  isFull,
  isPerfect,
} from '../../src/utils/treeValidation';

describe('Tree Validation', () => {
  describe('isTree', () => {
    it('should return true for valid tree', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      const node2 = graph.addLeaf(2, 'node2');
      const node3 = graph.addLeaf(3, 'node3');
      graph.addBranch(root, node2);
      graph.addBranch(root, node3);

      expect(isTree(graph)).toBe(true);
    });

    it('should return false for graph with cycle', () => {
      const graph = new Graph<number>();
      const n1 = graph.addLeaf(1, 'n1');
      const n2 = graph.addLeaf(2, 'n2');
      graph.addBranch(n1, n2);
      graph.addBranch(n2, n1);

      expect(isTree(graph)).toBe(false);
    });

    it('should return true for empty graph', () => {
      const graph = new Graph<number>();
      expect(isTree(graph)).toBe(true);
    });

    it('should return false for disconnected graph', () => {
      const graph = new Graph<number>();
      const n1 = graph.addLeaf(1, 'n1');
      const n2 = graph.addLeaf(2, 'n2');
      // No branches - disconnected
      expect(isTree(graph)).toBe(false);
    });
  });

  describe('isBST', () => {
    it('should return true for valid BST', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(5, 'root');
      const left = graph.addLeaf(3, 'left');
      const right = graph.addLeaf(7, 'right');
      graph.addBranch(root, left);
      graph.addBranch(root, right);

      expect(isBST(root)).toBe(true);
    });

    it('should return false for invalid BST', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(5, 'root');
      const left = graph.addLeaf(7, 'left'); // Invalid: 7 > 5
      graph.addBranch(root, left);

      expect(isBST(root)).toBe(false);
    });

    it('should work with custom compare function', () => {
      const graph = new Graph<string>();
      const root = graph.addLeaf('m', 'root');
      const left = graph.addLeaf('a', 'left');
      const right = graph.addLeaf('z', 'right');
      graph.addBranch(root, left);
      graph.addBranch(root, right);

      const compare = (a: string, b: string) => a.localeCompare(b);
      expect(isBST(root, compare)).toBe(true);
    });

    it('should return true for single node', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(5, 'root');
      expect(isBST(root)).toBe(true);
    });
  });

  describe('isBalanced', () => {
    it('should return true for balanced tree', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      const left = graph.addLeaf(2, 'left');
      const right = graph.addLeaf(3, 'right');
      graph.addBranch(root, left);
      graph.addBranch(root, right);

      expect(isBalanced(root)).toBe(true);
    });

    it('should return false for unbalanced tree', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      const left = graph.addLeaf(2, 'left');
      const leftLeft = graph.addLeaf(3, 'leftLeft');
      const leftLeftLeft = graph.addLeaf(4, 'leftLeftLeft');
      const leftLeftLeftLeft = graph.addLeaf(5, 'leftLeftLeftLeft');
      graph.addBranch(root, left);
      graph.addBranch(left, leftLeft);
      graph.addBranch(leftLeft, leftLeftLeft);
      graph.addBranch(leftLeftLeft, leftLeftLeftLeft);

      // This creates a very unbalanced tree (height difference > 1)
      expect(isBalanced(root)).toBe(false);
    });

    it('should return true for single node', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      expect(isBalanced(root)).toBe(true);
    });
  });

  describe('isComplete', () => {
    it('should return true for complete binary tree', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      const left = graph.addLeaf(2, 'left');
      const right = graph.addLeaf(3, 'right');
      graph.addBranch(root, left);
      graph.addBranch(root, right);

      expect(isComplete(root)).toBe(true);
    });

    it('should return true for single node', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      expect(isComplete(root)).toBe(true);
    });
  });

  describe('isFull', () => {
    it('should return true for full binary tree', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      const left = graph.addLeaf(2, 'left');
      const right = graph.addLeaf(3, 'right');
      graph.addBranch(root, left);
      graph.addBranch(root, right);

      expect(isFull(root)).toBe(true);
    });

    it('should return false for tree with node having one child', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      const left = graph.addLeaf(2, 'left');
      graph.addBranch(root, left);

      expect(isFull(root)).toBe(false);
    });

    it('should return true for single node (leaf)', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      expect(isFull(root)).toBe(true);
    });
  });

  describe('isPerfect', () => {
    it('should return true for perfect binary tree', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      const left = graph.addLeaf(2, 'left');
      const right = graph.addLeaf(3, 'right');
      graph.addBranch(root, left);
      graph.addBranch(root, right);

      expect(isPerfect(root)).toBe(true);
    });

    it('should return true for single node', () => {
      const graph = new Graph<number>();
      const root = graph.addLeaf(1, 'root');
      expect(isPerfect(root)).toBe(true);
    });
  });
});
