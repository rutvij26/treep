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
  // Cached arrays to avoid Array.from() overhead
  private _leaves: Node<T>[] = [];
  private _branches: Branch<T>[] = [];
  private _leavesDirty = true;
  private _branchesDirty = true;

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
   * @param id - Optional ID for the leaf (auto-generated if not provided, or uses value if value is string/number)
   * @returns The created leaf
   */
  addLeaf(value: T, id?: string | number): Node<T> {
    if (id === undefined) {
      // If value is a string or number, use it as the ID for convenience
      if (typeof value === 'string' || typeof value === 'number') {
        id = value;
      } else {
        id = this.generateId();
      }
    }

    if (this.leavesMap.has(id)) {
      throw new GraphError(`Leaf with id "${id}" already exists`, 'DUPLICATE_LEAF', id.toString());
    }

    const leaf = new Node(id, value);
    this.leavesMap.set(id, leaf);
    this._leavesDirty = true;
    return leaf;
  }

  /**
   * Add a branch (edge) between two leaves
   * @param from - Source leaf or its ID
   * @param to - Target leaf or its ID
   * @param weight - Optional weight for the branch
   * @returns The created branch
   */
  addBranch(
    from: Node<T> | string | number,
    to: Node<T> | string | number,
    weight?: number
  ): Branch<T> {
    // Resolve from leaf
    let fromLeaf: Node<T>;
    if (from instanceof Node) {
      fromLeaf = from;
    } else {
      const leaf = this.getLeaf(from);
      if (!leaf) {
        throw new GraphError(
          `Source leaf with id "${from}" not found in graph`,
          'LEAF_NOT_FOUND',
          String(from)
        );
      }
      fromLeaf = leaf;
    }

    // Resolve to leaf
    let toLeaf: Node<T>;
    if (to instanceof Node) {
      toLeaf = to;
    } else {
      const leaf = this.getLeaf(to);
      if (!leaf) {
        throw new GraphError(
          `Target leaf with id "${to}" not found in graph`,
          'LEAF_NOT_FOUND',
          String(to)
        );
      }
      toLeaf = leaf;
    }

    // Validate leaves exist in graph
    if (!this.leavesMap.has(fromLeaf.id)) {
      throw new GraphError(
        `Source leaf with id "${fromLeaf.id}" not found in graph`,
        'LEAF_NOT_FOUND',
        String(fromLeaf.id)
      );
    }

    if (!this.leavesMap.has(toLeaf.id)) {
      throw new GraphError(
        `Target leaf with id "${toLeaf.id}" not found in graph`,
        'LEAF_NOT_FOUND',
        String(toLeaf.id)
      );
    }

    const branch = new Branch(fromLeaf, toLeaf, weight);
    this.branchesSet.add(branch);
    fromLeaf.addBranch(branch);
    this._branchesDirty = true;

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
    this._leavesDirty = true;
  }

  /**
   * Remove a branch from the graph
   */
  removeBranch(branch: Branch<T>): void {
    if (this.branchesSet.has(branch)) {
      this.branchesSet.delete(branch);
      branch.from.removeBranch(branch);
      this._branchesDirty = true;
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
   * Uses cached array for performance
   */
  leaves(): Node<T>[] {
    if (this._leavesDirty) {
      this._leaves = Array.from(this.leavesMap.values());
      this._leavesDirty = false;
    }
    return this._leaves;
  }

  /**
   * Get all leaves as an iterator (memory efficient for large graphs)
   */
  *leavesIterator(): Generator<Node<T>, void, unknown> {
    for (const leaf of this.leavesMap.values()) {
      yield leaf;
    }
  }

  /**
   * Get all branches in the graph
   * Uses cached array for performance
   */
  branches(): Branch<T>[] {
    if (this._branchesDirty) {
      this._branches = Array.from(this.branchesSet.values());
      this._branchesDirty = false;
    }
    return this._branches;
  }

  /**
   * Get all branches as an iterator (memory efficient for large graphs)
   */
  *branchesIterator(): Generator<Branch<T>, void, unknown> {
    for (const branch of this.branchesSet.values()) {
      yield branch;
    }
  }

  /**
   * Check if a leaf exists in the graph
   */
  hasLeaf(id: string | number): boolean {
    return this.leavesMap.has(id);
  }

  /**
   * Check if a branch exists in the graph
   * Optimized: checks from node's branches directly instead of iterating all branches
   */
  hasBranch(from: Node<T>, to: Node<T>): boolean {
    // Check if from node has a branch to to node - O(degree) instead of O(E)
    return from.branches.some(branch => branch.to === to && this.branchesSet.has(branch));
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
    this._leaves = [];
    this._branches = [];
    this._leavesDirty = true;
    this._branchesDirty = true;
  }

  /**
   * Generate a unique ID for a leaf
   */
  /**
   * Generate a unique ID for a leaf
   * @returns A unique ID string
   */
  generateId(): string {
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
