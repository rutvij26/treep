import { Graph } from '../../src/core/Graph';
import {
  findRoot,
  isRoot,
  getRoot,
  getParent,
  getChildren,
  getSiblings,
  getAncestors,
  getDescendants,
  getHeight,
  getDepth,
  getTreeSize,
  getWidth,
} from '../../src/utils/treeOperations';
import { TreeError } from '../../src/errors/TreeError';

describe('Tree Operations', () => {
  let graph: Graph<number>;
  let root: any;
  let node2: any;
  let node3: any;
  let node4: any;
  let node5: any;

  beforeEach(() => {
    graph = new Graph<number>();
    root = graph.addLeaf(1, 'root');
    node2 = graph.addLeaf(2, 'node2');
    node3 = graph.addLeaf(3, 'node3');
    node4 = graph.addLeaf(4, 'node4');
    node5 = graph.addLeaf(5, 'node5');

    // Create a tree structure:
    //       1
    //      / \
    //     2   3
    //    / \
    //   4   5
    graph.addBranch(root, node2);
    graph.addBranch(root, node3);
    graph.addBranch(node2, node4);
    graph.addBranch(node2, node5);
  });

  describe('findRoot', () => {
    it('should find the root of a tree', () => {
      const foundRoot = findRoot(graph);
      expect(foundRoot).toBe(root);
    });

    it('should return null for empty graph', () => {
      const emptyGraph = new Graph<number>();
      expect(findRoot(emptyGraph)).toBeNull();
    });

    it('should throw error for multiple roots', () => {
      const multiGraph = new Graph<number>();
      const r1 = multiGraph.addLeaf(1, 'r1');
      const r2 = multiGraph.addLeaf(2, 'r2');
      expect(() => findRoot(multiGraph)).toThrow(TreeError);
    });

    it('should return first node if all have incoming edges', () => {
      const cycleGraph = new Graph<number>();
      const n1 = cycleGraph.addLeaf(1, 'n1');
      const n2 = cycleGraph.addLeaf(2, 'n2');
      cycleGraph.addBranch(n1, n2);
      cycleGraph.addBranch(n2, n1);
      const result = findRoot(cycleGraph);
      expect(result).toBe(n1);
    });
  });

  describe('isRoot', () => {
    it('should return true for root node', () => {
      expect(isRoot(root, graph)).toBe(true);
    });

    it('should return false for non-root node', () => {
      expect(isRoot(node2, graph)).toBe(false);
      expect(isRoot(node3, graph)).toBe(false);
      expect(isRoot(node4, graph)).toBe(false);
    });
  });

  describe('getRoot', () => {
    it('should get root from any node', () => {
      expect(getRoot(node4, graph)).toBe(root);
      expect(getRoot(node2, graph)).toBe(root);
      expect(getRoot(root, graph)).toBe(root);
    });

    it('should throw error on cycle', () => {
      const cycleGraph = new Graph<number>();
      const n1 = cycleGraph.addLeaf(1, 'n1');
      const n2 = cycleGraph.addLeaf(2, 'n2');
      cycleGraph.addBranch(n1, n2);
      cycleGraph.addBranch(n2, n1);
      expect(() => getRoot(n1, cycleGraph)).toThrow(TreeError);
    });
  });

  describe('getParent', () => {
    it('should get parent of a node', () => {
      expect(getParent(node2, graph)).toBe(root);
      expect(getParent(node4, graph)).toBe(node2);
      expect(getParent(root, graph)).toBeNull();
    });
  });

  describe('getChildren', () => {
    it('should get children of a node', () => {
      const children = getChildren(root);
      expect(children.length).toBe(2);
      expect(children).toContain(node2);
      expect(children).toContain(node3);
    });

    it('should return empty array for leaf node', () => {
      const children = getChildren(node4);
      expect(children).toEqual([]);
    });
  });

  describe('getSiblings', () => {
    it('should get siblings of a node', () => {
      const siblings = getSiblings(node2, graph);
      expect(siblings.length).toBe(1);
      expect(siblings).toContain(node3);
    });

    it('should return empty array for root', () => {
      const siblings = getSiblings(root, graph);
      expect(siblings).toEqual([]);
    });

    it('should return siblings for node4', () => {
      const siblings = getSiblings(node4, graph);
      expect(siblings).toContain(node5);
    });
  });

  describe('getAncestors', () => {
    it('should get all ancestors of a node', () => {
      const ancestors = getAncestors(node4, graph);
      expect(ancestors.length).toBe(2);
      expect(ancestors).toContain(node2);
      expect(ancestors).toContain(root);
    });

    it('should return empty array for root', () => {
      const ancestors = getAncestors(root, graph);
      expect(ancestors).toEqual([]);
    });

    it('should throw error on cycle', () => {
      const cycleGraph = new Graph<number>();
      const n1 = cycleGraph.addLeaf(1, 'n1');
      const n2 = cycleGraph.addLeaf(2, 'n2');
      cycleGraph.addBranch(n1, n2);
      cycleGraph.addBranch(n2, n1);
      expect(() => getAncestors(n1, cycleGraph)).toThrow(TreeError);
    });
  });

  describe('getDescendants', () => {
    it('should get all descendants of a node', () => {
      const descendants = getDescendants(root);
      expect(descendants.length).toBe(4);
      expect(descendants).toContain(node2);
      expect(descendants).toContain(node3);
      expect(descendants).toContain(node4);
      expect(descendants).toContain(node5);
    });

    it('should return empty array for leaf node', () => {
      const descendants = getDescendants(node4);
      expect(descendants).toEqual([]);
    });
  });

  describe('getHeight', () => {
    it('should calculate height of tree', () => {
      expect(getHeight(root)).toBe(2); // root -> node2 -> node4
    });

    it('should return 0 for single node', () => {
      const singleGraph = new Graph<number>();
      const single = singleGraph.addLeaf(1, 'single');
      expect(getHeight(single)).toBe(0);
    });
  });

  describe('getDepth', () => {
    it('should calculate depth of a node', () => {
      expect(getDepth(root, graph)).toBe(0);
      expect(getDepth(node2, graph)).toBe(1);
      expect(getDepth(node4, graph)).toBe(2);
    });
  });

  describe('getTreeSize', () => {
    it('should calculate size of tree', () => {
      expect(getTreeSize(root)).toBe(5);
    });

    it('should return 1 for single node', () => {
      const singleGraph = new Graph<number>();
      const single = singleGraph.addLeaf(1, 'single');
      expect(getTreeSize(single)).toBe(1);
    });
  });

  describe('getWidth', () => {
    it('should calculate width of tree', () => {
      expect(getWidth(root)).toBe(2); // Level 1 has 2 nodes
    });

    it('should return 1 for single node', () => {
      const singleGraph = new Graph<number>();
      const single = singleGraph.addLeaf(1, 'single');
      expect(getWidth(single)).toBe(1);
    });
  });
});
