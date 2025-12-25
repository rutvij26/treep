// Core classes
export { Node } from './core/Node';
export { Branch } from './core/Branch';
export { Graph } from './core/Graph';

// Algorithms
export { BFS } from './algorithms/bfs';
export { DFS } from './algorithms/dfs';
export { shortestPath } from './algorithms/shortestPath';
export { detectCycles } from './algorithms/cycleDetection';
export { allPaths } from './algorithms/allPaths';
export { topologicalSort, isDAG } from './algorithms/topologicalSort';
export {
  findConnectedComponents,
  findStronglyConnectedComponents,
  countConnectedComponents,
} from './algorithms/connectedComponents';
export {
  findPathsWithConstraints,
  findShortestPathWithConstraints,
  findPathsAvoiding,
  findPathsThrough,
} from './algorithms/pathFinding';
export type { PathConstraints } from './algorithms/pathFinding';
export { lazyBFS, lazyDFS, lazyFindPaths, lazyAllPaths, lazyFindLeaves } from './algorithms/lazy';

// Errors
export {
  TreepError,
  GraphError,
  TreeError,
  ValidationError,
  type ValidationErrorDetail,
  TypeError,
} from './errors';

// Utilities
export {
  normalize,
  fromJSON,
  mergeGraph,
  renderASCII,
  validate,
  validateLeaf,
  validateBranch,
  validateGraph,
  validateTree,
  toJSON,
  toJSONString,
  getStatistics,
  findLeaves,
  findLeaf,
  findBranches,
  findBranch,
  filterLeavesByValue,
  filterBranchesByWeight,
  extractSubgraph,
  extractReachableSubgraph,
  toDOT,
  toAdjacencyList,
  toEdgeList,
  toAdjacencyMatrix,
  reverseGraph,
  toUndirected,
  transpose,
  filterBranches,
  filterLeaves,
  fromJSONStream,
  toJSONStream,
  toAsyncStream,
} from './utils';
export type {
  NormalizeOptions,
  FromJSONOptions,
  MergeGraphOptions,
  RenderOptions,
  Schema,
  SchemaField,
  ValidationResult,
  ToJSONOptions,
  SerializedGraph,
  GraphStatistics,
  LeafPredicate,
  BranchPredicate,
  QueryLeavesOptions,
  SubgraphOptions,
  StreamingJSONOptions,
} from './utils';
