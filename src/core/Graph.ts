import { Node } from './Node';
import { Branch } from './Branch';
import { GraphError } from '../errors/GraphError';

/**
 * Graph manages leaves (nodes) and branches (edges)
 * Uses tree metaphor throughout: Node = Leaf, Edge = Branch
 */
export class Graph<T> {
  private leavesMap: Map<string | number, Node<T>>;
  private branchesSet: Set<Branch<T>>;

  constructor(data?: Array<{ id: string | number; value: T }>) {
    this.leavesMap = new Map();
    this.branchesSet = new Set();

    if (data) {
      for (const item of data) {
        this.addLeaf(item.value, item.id);
      }
    }
  }

  /**
   * Add a leaf (node) to the graph
   * @param value - The value stored in the leaf
   * @param id - Optional ID for the leaf (auto-generated if not provided)
   * @returns The created leaf
   */
  addLeaf(value: T, id?: string | number): Node<T> {
    if (id === undefined) {
      id = this.generateId();
    }

    if (this.leavesMap.has(id)) {
      throw new GraphError(`Leaf with id "${id}" already exists`, 'DUPLICATE_LEAF', id.toString());
    }

    const leaf = new Node(id, value);
    this.leavesMap.set(id, leaf);
    return leaf;
  }

  /**
   * Add a branch (edge) between two leaves
   * @param from - Source leaf
   * @param to - Target leaf
   * @param weight - Optional weight for the branch
   * @returns The created branch
   */
  addBranch(from: Node<T>, to: Node<T>, weight?: number): Branch<T> {
    if (!this.leavesMap.has(from.id)) {
      throw new GraphError(
        `Source leaf with id "${from.id}" not found in graph`,
        'LEAF_NOT_FOUND',
        from.id.toString()
      );
    }

    if (!this.leavesMap.has(to.id)) {
      throw new GraphError(
        `Target leaf with id "${to.id}" not found in graph`,
        'LEAF_NOT_FOUND',
        to.id.toString()
      );
    }

    const branch = new Branch(from, to, weight);
    this.branchesSet.add(branch);
    from.addBranch(branch);

    return branch;
  }

  /**
   * Remove a leaf from the graph
   * Also removes all branches connected to this leaf
   */
  removeLeaf(leaf: Node<T>): void {
    if (!this.leavesMap.has(leaf.id)) {
      return;
    }

    // Remove all branches connected to this leaf
    const branchesToRemove: Branch<T>[] = [];
    for (const branch of this.branchesSet) {
      if (branch.from === leaf || branch.to === leaf) {
        branchesToRemove.push(branch);
      }
    }

    for (const branch of branchesToRemove) {
      this.removeBranch(branch);
    }

    this.leavesMap.delete(leaf.id);
  }

  /**
   * Remove a branch from the graph
   */
  removeBranch(branch: Branch<T>): void {
    if (this.branchesSet.has(branch)) {
      this.branchesSet.delete(branch);
      branch.from.removeBranch(branch);
    }
  }

  /**
   * Get a leaf by its ID
   */
  getLeaf(id: string | number): Node<T> | undefined {
    return this.leavesMap.get(id);
  }

  /**
   * Get all leaves in the graph
   */
  leaves(): Node<T>[] {
    return Array.from(this.leavesMap.values());
  }

  /**
   * Get all branches in the graph
   */
  branches(): Branch<T>[] {
    return Array.from(this.branchesSet.values());
  }

  /**
   * Check if a leaf exists in the graph
   */
  hasLeaf(id: string | number): boolean {
    return this.leavesMap.has(id);
  }

  /**
   * Check if a branch exists in the graph
   */
  hasBranch(from: Node<T>, to: Node<T>): boolean {
    return Array.from(this.branchesSet).some(branch => branch.from === from && branch.to === to);
  }

  /**
   * Get the number of leaves in the graph
   */
  size(): number {
    return this.leavesMap.size;
  }

  /**
   * Get the number of branches in the graph
   */
  branchCount(): number {
    return this.branchesSet.size;
  }

  /**
   * Check if the graph is empty
   */
  isEmpty(): boolean {
    return this.leavesMap.size === 0;
  }

  /**
   * Clear all leaves and branches from the graph
   */
  clear(): void {
    this.leavesMap.clear();
    this.branchesSet.clear();
  }

  /**
   * Generate a unique ID for a leaf
   */
  private generateId(): string {
    let id: string;
    let counter = 0;
    do {
      id = `leaf_${Date.now()}_${counter++}`;
    } while (this.leavesMap.has(id) && counter < 1000);

    if (this.leavesMap.has(id)) {
      throw new GraphError('Unable to generate unique leaf ID', 'ID_GENERATION_FAILED');
    }

    return id;
  }
}
