// API Documentation Data - Comprehensive API Reference
// This file contains all API documentation with real-world examples

var API_DATA = {
  // ========== CORE CLASSES ==========
  "Graph": {
    "name": "Graph",
    "type": "Class",
    "signature": "Graph&lt;T&gt;",
    "description": "Main container for graph structure. Manages leaves (nodes) and branches (edges). Use this to model relationships like social networks, file systems, or dependency graphs.",
    "since": "1.0.0",
    "methods": [
      {"name": "constructor", "signature": "constructor(data?: Array&lt;{ id: string | number; value: T }&gt;)", "description": "Create a new graph, optionally with initial data"},
      {"name": "addLeaf", "signature": "addLeaf(value: T, id?: string | number): Node&lt;T&gt;", "description": "Add a leaf (node) to the graph"},
      {"name": "addBranch", "signature": "addBranch(from: Node&lt;T&gt;, to: Node&lt;T&gt;, weight?: number): Branch&lt;T&gt;", "description": "Add a branch (edge) between two leaves"},
      {"name": "removeLeaf", "signature": "removeLeaf(leaf: Node&lt;T&gt;): void", "description": "Remove a leaf and all connected branches"},
      {"name": "removeBranch", "signature": "removeBranch(branch: Branch&lt;T&gt;): void", "description": "Remove a branch from the graph"},
      {"name": "getLeaf", "signature": "getLeaf(id: string | number): Node&lt;T&gt; | undefined", "description": "Get a leaf by ID"},
      {"name": "leaves", "signature": "leaves(): Node&lt;T&gt;[]", "description": "Get all leaves in the graph"},
      {"name": "branches", "signature": "branches(): Branch&lt;T&gt;[]", "description": "Get all branches in the graph"},
      {"name": "hasLeaf", "signature": "hasLeaf(id: string | number): boolean", "description": "Check if a leaf exists"},
      {"name": "hasBranch", "signature": "hasBranch(from: Node&lt;T&gt;, to: Node&lt;T&gt;): boolean", "description": "Check if a branch exists between two leaves"},
      {"name": "size", "signature": "size(): number", "description": "Get the number of leaves"},
      {"name": "branchCount", "signature": "branchCount(): number", "description": "Get the number of branches"},
      {"name": "isEmpty", "signature": "isEmpty(): boolean", "description": "Check if the graph is empty"},
      {"name": "clear", "signature": "clear(): void", "description": "Remove all leaves and branches"}
    ],
    "example": "// Real-world: Building a social network\nimport { Graph } from 'treep';\n\ninterface User { name: string; email: string; }\nconst network = new Graph&lt;User&gt;();\n\n// Add users\nconst alice = network.addLeaf({ name: 'Alice', email: 'alice@example.com' }, 'alice');\nconst bob = network.addLeaf({ name: 'Bob', email: 'bob@example.com' }, 'bob');\n\n// Create friendship connection\nnetwork.addBranch(alice, bob);\n\n// Check if users are connected\nif (network.hasBranch(alice, bob)) {\n  console.log('Alice and Bob are friends');\n}"
  },
  "Node": {
    "name": "Node",
    "type": "Class",
    "signature": "Node&lt;T&gt;",
    "description": "Represents a node (leaf) in the graph with a value and connections. Each node can store custom data and track its relationships.",
    "since": "1.0.0",
    "properties": [
      {"name": "id", "type": "string | number", "description": "Unique identifier"},
      {"name": "value", "type": "T", "description": "Stored value"},
      {"name": "branches", "type": "Branch&lt;T&gt;[]", "description": "Outgoing branches"}
    ],
    "methods": [
      {"name": "getConnectedLeaves", "signature": "getConnectedLeaves(): Node&lt;T&gt;[]", "description": "Get all leaves connected via outgoing branches"},
      {"name": "hasBranchTo", "signature": "hasBranchTo(leaf: Node&lt;T&gt;): boolean", "description": "Check if there's a branch to another leaf"},
      {"name": "getOutDegree", "signature": "getOutDegree(): number", "description": "Get the number of outgoing branches"}
    ],
    "example": "// Real-world: Analyzing user connections in a social network\nconst user = network.getLeaf('alice');\nif (user) {\n  const friends = user.getConnectedLeaves();\n  console.log(`${user.value.name} has ${friends.length} friends`);\n  console.log(`Connection count: ${user.getOutDegree()}`);\n}"
  },
  "Branch": {
    "name": "Branch",
    "type": "Class",
    "signature": "Branch&lt;T&gt;",
    "description": "Represents an edge (branch) between two leaves, optionally with a weight. Use weights for distance, cost, or relationship strength.",
    "since": "1.0.0",
    "properties": [
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"},
      {"name": "weight", "type": "number | undefined", "description": "Optional weight"}
    ],
    "methods": [
      {"name": "isWeighted", "signature": "isWeighted(): boolean", "description": "Check if the branch has a weight"},
      {"name": "getOtherLeaf", "signature": "getOtherLeaf(leaf: Node&lt;T&gt;): Node&lt;T&gt;", "description": "Get the other leaf in the branch"}
    ],
    "example": "// Real-world: Modeling delivery routes with distances\nconst route = network.addBranch(warehouse, store, 15); // 15 miles\nif (route.isWeighted()) {\n  console.log(`Distance: ${route.weight} miles`);\n  const destination = route.getOtherLeaf(warehouse);\n  console.log(`Delivering to: ${destination.value.name}`);\n}"
  },
  
  // ========== ALGORITHMS ==========
  "BFS": {
    "name": "BFS",
    "type": "Function",
    "signature": "BFS&lt;T&gt;(start: Node&lt;T&gt;, visit?: (leaf: Node&lt;T&gt;) => void): Node&lt;T&gt;[]",
    "description": "Breadth-First Search traversal. Perfect for finding shortest unweighted paths, level-order processing, or exploring all reachable nodes.",
    "since": "1.0.0",
    "arguments": [
      {"name": "start", "type": "Node&lt;T&gt;", "description": "The starting leaf for traversal"},
      {"name": "visit", "type": "(leaf: Node&lt;T&gt;) => void", "optional": true, "description": "Optional callback function called for each visited leaf"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of all visited leaves in BFS order",
    "example": "// Real-world: Finding all friends within 2 degrees of separation\nimport { BFS } from 'treep';\n\nconst visited = BFS(user, (leaf) => {\n  console.log(`Visiting: ${leaf.value.name}`);\n});\n\n// Process users level by level (closest friends first)\nvisited.forEach((user, index) => {\n  console.log(`Level ${index}: ${user.value.name}`);\n});"
  },
  "DFS": {
    "name": "DFS",
    "type": "Function",
    "signature": "DFS&lt;T&gt;(start: Node&lt;T&gt;, visit?: (leaf: Node&lt;T&gt;) => void): Node&lt;T&gt;[]",
    "description": "Depth-First Search traversal. Ideal for exploring deep paths, dependency resolution, or backtracking algorithms.",
    "since": "1.0.0",
    "arguments": [
      {"name": "start", "type": "Node&lt;T&gt;", "description": "The starting leaf for traversal"},
      {"name": "visit", "type": "(leaf: Node&lt;T&gt;) => void", "optional": true, "description": "Optional callback function called for each visited leaf"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of all visited leaves in DFS order",
    "example": "// Real-world: Exploring a file system directory structure\nimport { DFS } from 'treep';\n\nconst files = DFS(rootDirectory, (file) => {\n  if (file.value.type === 'directory') {\n    console.log(`Entering: ${file.value.path}`);\n  }\n});\n\n// Files are visited in depth-first order (deepest first)"
  },
  "shortestPath": {
    "name": "shortestPath",
    "type": "Function",
    "signature": "shortestPath&lt;T&gt;(from: Node&lt;T&gt;, to: Node&lt;T&gt;, branches?: Branch&lt;T&gt;[]): Node&lt;T&gt;[] | null",
    "description": "Find the shortest path between two nodes. Uses BFS for unweighted graphs, Dijkstra's algorithm for weighted graphs. Perfect for navigation, routing, or finding optimal connections.",
    "since": "1.0.0",
    "arguments": [
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"},
      {"name": "branches", "type": "Branch&lt;T&gt;[]", "optional": true, "description": "Optional array of branches to use (for weighted graphs)"}
    ],
    "returns": "Node&lt;T&gt;[] | null",
    "returnsDescription": "Array of leaves representing the shortest path, or null if no path exists",
    "example": "// Real-world: GPS navigation finding shortest route\nimport { shortestPath } from 'treep';\n\n// Unweighted: Find minimum number of stops\nconst route = shortestPath(startLocation, destination);\n\n// Weighted: Find shortest distance (using branch weights)\nconst optimalRoute = shortestPath(startLocation, destination, map.branches());\n\nif (optimalRoute) {\n  console.log(`Route has ${optimalRoute.length} stops`);\n  optimalRoute.forEach((location, i) => {\n    console.log(`${i + 1}. ${location.value.name}`);\n  });\n} else {\n  console.log('No route found');\n}"
  },
  "allPaths": {
    "name": "allPaths",
    "type": "Function",
    "signature": "allPaths&lt;T&gt;(from: Node&lt;T&gt;, to: Node&lt;T&gt;): Node&lt;T&gt;[][]",
    "description": "Find all possible paths between two nodes. Useful for exploring alternatives, finding backup routes, or analyzing connectivity.",
    "since": "1.0.0",
    "arguments": [
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"}
    ],
    "returns": "Node&lt;T&gt;[][]",
    "returnsDescription": "Array of all paths, where each path is an array of leaves",
    "example": "// Real-world: Finding all possible flight routes between cities\nimport { allPaths } from 'treep';\n\nconst routes = allPaths(newYork, tokyo);\nconsole.log(`Found ${routes.length} possible routes`);\n\nroutes.forEach((route, index) => {\n  console.log(`Route ${index + 1}: ${route.map(n => n.value.city).join(' → ')}`);\n});"
  },
  "detectCycles": {
    "name": "detectCycles",
    "type": "Function",
    "signature": "detectCycles&lt;T&gt;(start: Node&lt;T&gt;): boolean",
    "description": "Detect if there are cycles in the graph starting from a node. Essential for validating acyclic structures like dependency graphs or workflows.",
    "since": "1.0.0",
    "arguments": [
      {"name": "start", "type": "Node&lt;T&gt;", "description": "Starting leaf to check for cycles"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if cycles are detected, false otherwise",
    "example": "// Real-world: Validating task dependencies to prevent circular dependencies\nimport { detectCycles } from 'treep';\n\nif (detectCycles(taskGraph)) {\n  console.error('Circular dependency detected! Tasks cannot be completed.');\n} else {\n  console.log('Task graph is valid - all tasks can be completed');\n}"
  },
  "topologicalSort": {
    "name": "topologicalSort",
    "type": "Function",
    "signature": "topologicalSort&lt;T&gt;(graph: Graph&lt;T&gt;): Node&lt;T&gt;[]",
    "description": "Perform topological sort on a directed acyclic graph (DAG). Returns nodes in an order where all dependencies come before dependents. Perfect for build systems, task scheduling, or course prerequisites.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to sort"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of leaves in topological order",
    "example": "// Real-world: Determining build order for software packages\nimport { topologicalSort } from 'treep';\n\n// Each package depends on others\nconst buildOrder = topologicalSort(packageGraph);\n\nbuildOrder.forEach((pkg, index) => {\n  console.log(`${index + 1}. Build ${pkg.value.name}`);\n});\n\n// Packages are ordered so dependencies are built first"
  },
  "isDAG": {
    "name": "isDAG",
    "type": "Function",
    "signature": "isDAG&lt;T&gt;(graph: Graph&lt;T&gt;): boolean",
    "description": "Check if the graph is a Directed Acyclic Graph (DAG). DAGs are essential for topological sorting and many scheduling algorithms.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to check"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if the graph is a DAG, false otherwise",
    "example": "// Real-world: Validating workflow can be executed\nimport { isDAG } from 'treep';\n\nif (isDAG(workflowGraph)) {\n  console.log('Workflow is valid - can be executed');\n  const executionOrder = topologicalSort(workflowGraph);\n} else {\n  console.error('Workflow has cycles - cannot determine execution order');\n}"
  },
  "findConnectedComponents": {
    "name": "findConnectedComponents",
    "type": "Function",
    "signature": "findConnectedComponents&lt;T&gt;(graph: Graph&lt;T&gt;): Node&lt;T&gt;[][]",
    "description": "Find all connected components in an undirected graph. Useful for identifying isolated groups, network clusters, or disconnected regions.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to analyze"}
    ],
    "returns": "Node&lt;T&gt;[][]",
    "returnsDescription": "Array of components, where each component is an array of connected leaves",
    "example": "// Real-world: Finding isolated user groups in a social network\nimport { findConnectedComponents } from 'treep';\n\nconst communities = findConnectedComponents(socialNetwork);\nconsole.log(`Found ${communities.length} communities`);\n\ncommunities.forEach((community, i) => {\n  console.log(`Community ${i + 1}: ${community.length} users`);\n  console.log(`Members: ${community.map(u => u.value.name).join(', ')}`);\n});"
  },
  "findStronglyConnectedComponents": {
    "name": "findStronglyConnectedComponents",
    "type": "Function",
    "signature": "findStronglyConnectedComponents&lt;T&gt;(graph: Graph&lt;T&gt;): Node&lt;T&gt;[][]",
    "description": "Find all strongly connected components in a directed graph. In a strongly connected component, every node can reach every other node. Useful for analyzing web page links or call graphs.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The directed graph to analyze"}
    ],
    "returns": "Node&lt;T&gt;[][]",
    "returnsDescription": "Array of strongly connected components",
    "example": "// Real-world: Finding mutually referencing web pages\nimport { findStronglyConnectedComponents } from 'treep';\n\nconst sccs = findStronglyConnectedComponents(webGraph);\nsccs.forEach((component, i) => {\n  console.log(`Component ${i + 1}: ${component.length} pages`);\n  // All pages in this component can reach each other\n});"
  },
  "countConnectedComponents": {
    "name": "countConnectedComponents",
    "type": "Function",
    "signature": "countConnectedComponents&lt;T&gt;(graph: Graph&lt;T&gt;): number",
    "description": "Count the number of connected components in a graph. Quick way to check graph connectivity.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to analyze"}
    ],
    "returns": "number",
    "returnsDescription": "Number of connected components",
    "example": "// Real-world: Checking network connectivity\nimport { countConnectedComponents } from 'treep';\n\nconst componentCount = countConnectedComponents(networkGraph);\nif (componentCount === 1) {\n  console.log('Network is fully connected');\n} else {\n  console.log(`Network has ${componentCount} isolated groups`);\n}"
  },
  "findPathsWithConstraints": {
    "name": "findPathsWithConstraints",
    "type": "Function",
    "signature": "findPathsWithConstraints&lt;T&gt;(graph: Graph&lt;T&gt;, from: Node&lt;T&gt;, to: Node&lt;T&gt;, constraints: PathConstraints&lt;T&gt;): Node&lt;T&gt;[][]",
    "description": "Find paths with constraints like maximum length, weight, or custom filters. Perfect for route planning with restrictions, budget constraints, or avoiding certain nodes.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"},
      {"name": "constraints", "type": "PathConstraints&lt;T&gt;", "description": "Constraints object with maxLength, maxWeight, leafFilter, branchFilter, maxPaths"}
    ],
    "returns": "Node&lt;T&gt;[][]",
    "returnsDescription": "Array of paths matching the constraints",
    "example": "// Real-world: Finding delivery routes avoiding toll roads and staying under budget\nimport { findPathsWithConstraints } from 'treep';\n\nconst routes = findPathsWithConstraints(map, warehouse, customer, {\n  maxLength: 10, // Max 10 stops\n  maxWeight: 50, // Max 50 miles total\n  leafFilter: (location) => !location.value.isClosed, // Skip closed locations\n  branchFilter: (branch) => !branch.weight || branch.weight < 10, // Avoid long segments\n  maxPaths: 5 // Return top 5 routes\n});\n\nroutes.forEach((route, i) => {\n  const totalDistance = route.reduce((sum, node, idx) => {\n    if (idx > 0) {\n      const branch = node.branches.find(b => b.from === route[idx - 1]);\n      return sum + (branch?.weight || 0);\n    }\n    return sum;\n  }, 0);\n  console.log(`Route ${i + 1}: ${totalDistance} miles`);\n});"
  },
  "findShortestPathWithConstraints": {
    "name": "findShortestPathWithConstraints",
    "type": "Function",
    "signature": "findShortestPathWithConstraints&lt;T&gt;(graph: Graph&lt;T&gt;, from: Node&lt;T&gt;, to: Node&lt;T&gt;, constraints: PathConstraints&lt;T&gt;): Node&lt;T&gt;[] | null",
    "description": "Find the shortest path that satisfies given constraints. Combines shortest path finding with filtering.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"},
      {"name": "constraints", "type": "PathConstraints&lt;T&gt;", "description": "Constraints to apply"}
    ],
    "returns": "Node&lt;T&gt;[] | null",
    "returnsDescription": "Shortest path matching constraints, or null if none found",
    "example": "// Real-world: Finding fastest route avoiding construction zones\nimport { findShortestPathWithConstraints } from 'treep';\n\nconst route = findShortestPathWithConstraints(map, home, work, {\n  maxLength: 20,\n  leafFilter: (location) => !location.value.hasConstruction,\n  maxWeight: 30 // Max 30 minutes\n});"
  },
  "findPathsAvoiding": {
    "name": "findPathsAvoiding",
    "type": "Function",
    "signature": "findPathsAvoiding&lt;T&gt;(graph: Graph&lt;T&gt;, from: Node&lt;T&gt;, to: Node&lt;T&gt;, avoid: Node&lt;T&gt;[]): Node&lt;T&gt;[][]",
    "description": "Find all paths that avoid specific nodes. Useful for route planning avoiding certain areas or nodes.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"},
      {"name": "avoid", "type": "Node&lt;T&gt;[]", "description": "Array of leaves to avoid"}
    ],
    "returns": "Node&lt;T&gt;[][]",
    "returnsDescription": "Array of paths that avoid the specified leaves",
    "example": "// Real-world: Finding routes avoiding traffic accidents or road closures\nimport { findPathsAvoiding } from 'treep';\n\nconst blockedLocations = [accidentSite, roadWork, closedBridge];\nconst alternativeRoutes = findPathsAvoiding(map, start, destination, blockedLocations);\n\nconsole.log(`Found ${alternativeRoutes.length} alternative routes`);"
  },
  "findPathsThrough": {
    "name": "findPathsThrough",
    "type": "Function",
    "signature": "findPathsThrough&lt;T&gt;(graph: Graph&lt;T&gt;, from: Node&lt;T&gt;, to: Node&lt;T&gt;, through: Node&lt;T&gt;[]): Node&lt;T&gt;[][]",
    "description": "Find all paths that pass through specific nodes. Perfect for multi-stop trips or required waypoints.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"},
      {"name": "through", "type": "Node&lt;T&gt;[]", "description": "Array of leaves that must be visited"}
    ],
    "returns": "Node&lt;T&gt;[][]",
    "returnsDescription": "Array of paths that pass through all specified leaves",
    "example": "// Real-world: Planning a delivery route with required stops\nimport { findPathsThrough } from 'treep';\n\nconst requiredStops = [pickupLocation, warehouse, distributionCenter];\nconst routes = findPathsThrough(map, start, end, requiredStops);\n\n// All routes will visit pickup, warehouse, and distribution center in some order"
  },
  
  // ========== LAZY EVALUATION ==========
  "lazyBFS": {
    "name": "lazyBFS",
    "type": "Function",
    "signature": "lazyBFS&lt;T&gt;(start: Node&lt;T&gt;): Generator&lt;Node&lt;T&gt;, void, unknown&gt;",
    "description": "Lazy BFS generator for memory-efficient traversal. Yields nodes one at a time instead of building an array. Perfect for large graphs or when you need early termination.",
    "since": "1.0.0",
    "arguments": [
      {"name": "start", "type": "Node&lt;T&gt;", "description": "Starting leaf"}
    ],
    "returns": "Generator&lt;Node&lt;T&gt;, void, unknown&gt;",
    "returnsDescription": "Generator that yields leaves in BFS order",
    "example": "// Real-world: Processing millions of users without loading all into memory\nimport { lazyBFS } from 'treep';\n\nfor (const user of lazyBFS(startUser)) {\n  if (user.value.isPremium) {\n    sendNotification(user);\n    break; // Stop after finding first premium user\n  }\n  // Process one user at a time, memory efficient\n}"
  },
  "lazyDFS": {
    "name": "lazyDFS",
    "type": "Function",
    "signature": "lazyDFS&lt;T&gt;(start: Node&lt;T&gt;): Generator&lt;Node&lt;T&gt;, void, unknown&gt;",
    "description": "Lazy DFS generator for memory-efficient deep traversal. Yields nodes as they're discovered.",
    "since": "1.0.0",
    "arguments": [
      {"name": "start", "type": "Node&lt;T&gt;", "description": "Starting leaf"}
    ],
    "returns": "Generator&lt;Node&lt;T&gt;, void, unknown&gt;",
    "returnsDescription": "Generator that yields leaves in DFS order",
    "example": "// Real-world: Searching deep file structures without loading everything\nimport { lazyDFS } from 'treep';\n\nfor (const file of lazyDFS(rootDirectory)) {\n  if (file.value.name.includes('.log')) {\n    analyzeLog(file);\n  }\n  // Process files one at a time, saving memory\n}"
  },
  "lazyFindPaths": {
    "name": "lazyFindPaths",
    "type": "Function",
    "signature": "lazyFindPaths&lt;T&gt;(graph: Graph&lt;T&gt;, from: Node&lt;T&gt;, to: Node&lt;T&gt;, constraints?: PathConstraints&lt;T&gt;): Generator&lt;Node&lt;T&gt;[], void, unknown&gt;",
    "description": "Lazy path finding with constraints. Yields paths one at a time, perfect for large search spaces.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"},
      {"name": "constraints", "type": "PathConstraints&lt;T&gt;", "optional": true, "description": "Optional constraints"}
    ],
    "returns": "Generator&lt;Node&lt;T&gt;[], void, unknown&gt;",
    "returnsDescription": "Generator that yields paths matching constraints",
    "example": "// Real-world: Finding routes one at a time until we find a good one\nimport { lazyFindPaths } from 'treep';\n\nfor (const route of lazyFindPaths(map, start, end, { maxLength: 10 })) {\n  if (isRouteAcceptable(route)) {\n    useRoute(route);\n    break; // Stop after finding first acceptable route\n  }\n}"
  },
  "lazyAllPaths": {
    "name": "lazyAllPaths",
    "type": "Function",
    "signature": "lazyAllPaths&lt;T&gt;(from: Node&lt;T&gt;, to: Node&lt;T&gt;): Generator&lt;Node&lt;T&gt;[], void, unknown&gt;",
    "description": "Lazy generator for all paths between two nodes. Memory efficient for graphs with many paths.",
    "since": "1.0.0",
    "arguments": [
      {"name": "from", "type": "Node&lt;T&gt;", "description": "Source leaf"},
      {"name": "to", "type": "Node&lt;T&gt;", "description": "Target leaf"}
    ],
    "returns": "Generator&lt;Node&lt;T&gt;[], void, unknown&gt;",
    "returnsDescription": "Generator that yields all paths",
    "example": "// Real-world: Evaluating multiple routes without storing all at once\nimport { lazyAllPaths } from 'treep';\n\nlet bestRoute = null;\nlet bestScore = Infinity;\n\nfor (const route of lazyAllPaths(start, end)) {\n  const score = calculateRouteScore(route);\n  if (score < bestScore) {\n    bestScore = score;\n    bestRoute = route;\n  }\n  // Only keep best route in memory\n}"
  },
  "lazyFindLeaves": {
    "name": "lazyFindLeaves",
    "type": "Function",
    "signature": "lazyFindLeaves&lt;T&gt;(graph: Graph&lt;T&gt;, predicate: (leaf: Node&lt;T&gt;) => boolean): Generator&lt;Node&lt;T&gt;, void, unknown&gt;",
    "description": "Lazy generator for finding leaves matching a predicate. Efficient for large graphs when you only need a few matches.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "predicate", "type": "(leaf: Node&lt;T&gt;) => boolean", "description": "Function that returns true for matching leaves"}
    ],
    "returns": "Generator&lt;Node&lt;T&gt;, void, unknown&gt;",
    "returnsDescription": "Generator that yields matching leaves",
    "example": "// Real-world: Finding active users without loading all users\nimport { lazyFindLeaves } from 'treep';\n\nconst activeUsers = [];\nfor (const user of lazyFindLeaves(network, u => u.value.isActive)) {\n  activeUsers.push(user);\n  if (activeUsers.length >= 100) break; // Stop after 100\n}"
  },
  
  // ========== TREE TRAVERSALS ==========
  "preOrder": {
    "name": "preOrder",
    "type": "Function",
    "signature": "preOrder&lt;T&gt;(root: Node&lt;T&gt;, visit?: (leaf: Node&lt;T&gt;) => void): Node&lt;T&gt;[]",
    "description": "Pre-order tree traversal (Root → Left → Right). Perfect for copying trees, prefix expressions, or printing directory structures.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root node of the tree"},
      {"name": "visit", "type": "(leaf: Node&lt;T&gt;) => void", "optional": true, "description": "Optional callback"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of nodes in pre-order",
    "example": "// Real-world: Printing directory structure with indentation\nimport { preOrder } from 'treep';\n\npreOrder(fileTree, (file) => {\n  const depth = getDepth(file);\n  console.log('  '.repeat(depth) + file.value.name);\n});\n// Output: root, then all children, maintaining tree structure"
  },
  "inOrder": {
    "name": "inOrder",
    "type": "Function",
    "signature": "inOrder&lt;T&gt;(root: Node&lt;T&gt;, visit?: (leaf: Node&lt;T&gt;) => void): Node&lt;T&gt;[]",
    "description": "In-order tree traversal (Left → Root → Right). Essential for binary search trees, producing sorted output.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root node"},
      {"name": "visit", "type": "(leaf: Node&lt;T&gt;) => void", "optional": true, "description": "Optional callback"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of nodes in in-order",
    "example": "// Real-world: Printing BST values in sorted order\nimport { inOrder } from 'treep';\n\nconst sortedValues = inOrder(bstRoot, (node) => {\n  console.log(node.value); // Prints in ascending order\n});"
  },
  "postOrder": {
    "name": "postOrder",
    "type": "Function",
    "signature": "postOrder&lt;T&gt;(root: Node&lt;T&gt;, visit?: (leaf: Node&lt;T&gt;) => void): Node&lt;T&gt;[]",
    "description": "Post-order tree traversal (Left → Right → Root). Ideal for deleting trees, postfix expressions, or calculating directory sizes.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root node"},
      {"name": "visit", "type": "(leaf: Node&lt;T&gt;) => void", "optional": true, "description": "Optional callback"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of nodes in post-order",
    "example": "// Real-world: Calculating total size of directory tree\nimport { postOrder } from 'treep';\n\nlet totalSize = 0;\npostOrder(directoryTree, (node) => {\n  if (node.value.type === 'file') {\n    totalSize += node.value.size;\n  } else {\n    // Directory size = sum of children\n    node.value.totalSize = totalSize;\n  }\n});"
  },
  "levelOrder": {
    "name": "levelOrder",
    "type": "Function",
    "signature": "levelOrder&lt;T&gt;(root: Node&lt;T&gt;, visit?: (leaf: Node&lt;T&gt;) => void): Node&lt;T&gt;[]",
    "description": "Level-order (breadth-first) tree traversal. Processes nodes level by level, perfect for printing trees or level-based operations.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root node"},
      {"name": "visit", "type": "(leaf: Node&lt;T&gt;) => void", "optional": true, "description": "Optional callback"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of nodes in level-order",
    "example": "// Real-world: Printing organizational chart by hierarchy level\nimport { levelOrder } from 'treep';\n\nlevelOrder(orgChart, (employee) => {\n  const level = getLevel(employee);\n  console.log(`Level ${level}: ${employee.value.name} - ${employee.value.title}`);\n});"
  },
  "treeTraversal": {
    "name": "treeTraversal",
    "type": "Function",
    "signature": "treeTraversal&lt;T&gt;(root: Node&lt;T&gt;, order: TraversalOrder, visit?: (leaf: Node&lt;T&gt;) => void): Node&lt;T&gt;[]",
    "description": "Generic tree traversal supporting all orders: 'pre-order', 'in-order', 'post-order', 'level-order'.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root node"},
      {"name": "order", "type": "TraversalOrder", "description": "Traversal order: 'pre-order' | 'in-order' | 'post-order' | 'level-order'"},
      {"name": "visit", "type": "(leaf: Node&lt;T&gt;) => void", "optional": true, "description": "Optional callback"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of nodes in specified order",
    "example": "// Real-world: Flexible tree processing based on use case\nimport { treeTraversal } from 'treep';\n\n// Choose traversal order based on requirement\nconst order = userPreference === 'sorted' ? 'in-order' : 'pre-order';\nconst nodes = treeTraversal(tree, order, (node) => {\n  processNode(node);\n});"
  },
  // ========== UTILITIES - SERIALIZATION ==========
  "toJSON": {
    "name": "toJSON",
    "type": "Function",
    "signature": "toJSON&lt;T&gt;(graph: Graph&lt;T&gt;, options?: ToJSONOptions): SerializedGraph",
    "description": "Serialize graph to JSON format. Perfect for saving graph state, API responses, or database storage.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to serialize"},
      {"name": "options", "type": "ToJSONOptions", "optional": true, "description": "Serialization options"}
    ],
    "returns": "SerializedGraph",
    "returnsDescription": "Serialized graph object with nodes and edges",
    "example": "// Real-world: Saving user network to database\nimport { toJSON } from 'treep';\n\nconst serialized = toJSON(socialNetwork);\nawait db.save('networks', serialized);\n// Later: const restored = fromJSON(serialized);"
  },
  "toJSONString": {
    "name": "toJSONString",
    "type": "Function",
    "signature": "toJSONString&lt;T&gt;(graph: Graph&lt;T&gt;, options?: ToJSONOptions): string",
    "description": "Serialize graph to JSON string. Useful for API responses or file storage.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to serialize"},
      {"name": "options", "type": "ToJSONOptions", "optional": true, "description": "Serialization options"}
    ],
    "returns": "string",
    "returnsDescription": "JSON string representation of the graph",
    "example": "// Real-world: Sending graph data via HTTP API\nimport { toJSONString } from 'treep';\n\nconst jsonString = toJSONString(graph);\nresponse.json(JSON.parse(jsonString));"
  },
  "fromJSON": {
    "name": "fromJSON",
    "type": "Function",
    "signature": "fromJSON&lt;T&gt;(data: SerializedGraph | string, options?: FromJSONOptions&lt;T&gt;): Graph&lt;T&gt;",
    "description": "Create graph from JSON data. Restore graphs from saved state or API responses.",
    "since": "1.0.0",
    "arguments": [
      {"name": "data", "type": "SerializedGraph | string", "description": "JSON data or string"},
      {"name": "options", "type": "FromJSONOptions&lt;T&gt;", "optional": true, "description": "Parsing options"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "Reconstructed graph",
    "example": "// Real-world: Loading graph from API response\nimport { fromJSON } from 'treep';\n\nconst response = await fetch('/api/graph');\nconst data = await response.json();\nconst graph = fromJSON(data);"
  },
  "fromJSONStream": {
    "name": "fromJSONStream",
    "type": "Function",
    "signature": "fromJSONStream&lt;T&gt;(stream: string | AsyncIterable&lt;string&gt;, options?: FromJSONStreamOptions&lt;T&gt;): Graph&lt;T&gt;",
    "description": "Create graph from streaming JSON. Memory efficient for large graphs loaded incrementally.",
    "since": "1.0.0",
    "arguments": [
      {"name": "stream", "type": "string | AsyncIterable&lt;string&gt;", "description": "JSON stream or string"},
      {"name": "options", "type": "FromJSONStreamOptions&lt;T&gt;", "optional": true, "description": "Streaming options"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "Graph built from stream",
    "example": "// Real-world: Loading huge network from file stream\nimport { fromJSONStream } from 'treep';\n\nconst fileStream = fs.createReadStream('large-network.json');\nconst graph = await fromJSONStream(fileStream);\n// Processes file in chunks, doesn't load entire file into memory"
  },
  "toJSONStream": {
    "name": "toJSONStream",
    "type": "Function",
    "signature": "toJSONStream&lt;T&gt;(graph: Graph&lt;T&gt;, options?: StreamingJSONOptions): Generator&lt;string, void, unknown&gt;",
    "description": "Serialize graph to streaming JSON chunks. Memory efficient for large graphs.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to serialize"},
      {"name": "options", "type": "StreamingJSONOptions", "optional": true, "description": "Streaming options"}
    ],
    "returns": "Generator&lt;string, void, unknown&gt;",
    "returnsDescription": "Generator yielding JSON chunks",
    "example": "// Real-world: Streaming large graph to file\nimport { toJSONStream } from 'treep';\n\nconst stream = toJSONStream(largeGraph);\nfor (const chunk of stream) {\n  await file.write(chunk);\n  // Write incrementally, saving memory"
  },
  "toAsyncStream": {
    "name": "toAsyncStream",
    "type": "Function",
    "signature": "toAsyncStream&lt;T&gt;(graph: Graph&lt;T&gt;, options?: StreamingJSONOptions): AsyncGenerator&lt;string, void, unknown&gt;",
    "description": "Serialize graph to async streaming JSON chunks. For async/await workflows.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to serialize"},
      {"name": "options", "type": "StreamingJSONOptions", "optional": true, "description": "Streaming options"}
    ],
    "returns": "AsyncGenerator&lt;string, void, unknown&gt;",
    "returnsDescription": "Async generator yielding JSON chunks",
    "example": "// Real-world: Async streaming to HTTP response\nimport { toAsyncStream } from 'treep';\n\nfor await (const chunk of toAsyncStream(graph)) {\n  response.write(chunk);\n}"
  },
  
  // ========== UTILITIES - STATISTICS & QUERY ==========
  "getStatistics": {
    "name": "getStatistics",
    "type": "Function",
    "signature": "getStatistics&lt;T&gt;(graph: Graph&lt;T&gt;): GraphStatistics",
    "description": "Get comprehensive statistics about the graph. Analyze network properties, connectivity, and structure.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to analyze"}
    ],
    "returns": "GraphStatistics",
    "returnsDescription": "Statistics object with totalLeaves, totalBranches, averageDegree, isWeighted, etc.",
    "example": "// Real-world: Analyzing social network metrics\nimport { getStatistics } from 'treep';\n\nconst stats = getStatistics(socialNetwork);\nconsole.log(`Users: ${stats.totalLeaves}`);\nconsole.log(`Connections: ${stats.totalBranches}`);\nconsole.log(`Avg friends per user: ${stats.averageDegree.toFixed(2)}`);\nconsole.log(`Has weighted connections: ${stats.isWeighted}`);"
  },
  "findLeaves": {
    "name": "findLeaves",
    "type": "Function",
    "signature": "findLeaves&lt;T&gt;(graph: Graph&lt;T&gt;, predicate: LeafPredicate&lt;T&gt;, options?: QueryLeavesOptions): Node&lt;T&gt;[]",
    "description": "Find all leaves matching a predicate. Search nodes by custom criteria.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "predicate", "type": "LeafPredicate&lt;T&gt;", "description": "Function returning true for matching leaves"},
      {"name": "options", "type": "QueryLeavesOptions", "optional": true, "description": "Query options like limit"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of matching leaves",
    "example": "// Real-world: Finding all premium users\nimport { findLeaves } from 'treep';\n\nconst premiumUsers = findLeaves(network, user => user.value.subscription === 'premium');\nconsole.log(`Found ${premiumUsers.length} premium users`);"
  },
  "findLeaf": {
    "name": "findLeaf",
    "type": "Function",
    "signature": "findLeaf&lt;T&gt;(graph: Graph&lt;T&gt;, predicate: LeafPredicate&lt;T&gt;): Node&lt;T&gt; | undefined",
    "description": "Find the first leaf matching a predicate. Efficient for finding a single match.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "predicate", "type": "LeafPredicate&lt;T&gt;", "description": "Matching function"}
    ],
    "returns": "Node&lt;T&gt; | undefined",
    "returnsDescription": "First matching leaf or undefined",
    "example": "// Real-world: Finding user by email\nimport { findLeaf } from 'treep';\n\nconst user = findLeaf(network, u => u.value.email === 'alice@example.com');\nif (user) {\n  console.log(`Found: ${user.value.name}`);\n}"
  },
  "findBranches": {
    "name": "findBranches",
    "type": "Function",
    "signature": "findBranches&lt;T&gt;(graph: Graph&lt;T&gt;, predicate: BranchPredicate&lt;T&gt;): Branch&lt;T&gt;[]",
    "description": "Find all branches matching a predicate. Search edges by custom criteria.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "predicate", "type": "BranchPredicate&lt;T&gt;", "description": "Matching function"}
    ],
    "returns": "Branch&lt;T&gt;[]",
    "returnsDescription": "Array of matching branches",
    "example": "// Real-world: Finding all long-distance connections\nimport { findBranches } from 'treep';\n\nconst longRoutes = findBranches(map, route => route.weight && route.weight > 100);\nconsole.log(`Found ${longRoutes.length} routes over 100 miles`);"
  },
  "findBranch": {
    "name": "findBranch",
    "type": "Function",
    "signature": "findBranch&lt;T&gt;(graph: Graph&lt;T&gt;, predicate: BranchPredicate&lt;T&gt;): Branch&lt;T&gt; | undefined",
    "description": "Find the first branch matching a predicate.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to search"},
      {"name": "predicate", "type": "BranchPredicate&lt;T&gt;", "description": "Matching function"}
    ],
    "returns": "Branch&lt;T&gt; | undefined",
    "returnsDescription": "First matching branch or undefined",
    "example": "// Real-world: Finding specific connection\nimport { findBranch } from 'treep';\n\nconst connection = findBranch(network, b => b.from.value.id === 'alice' && b.to.value.id === 'bob');"
  },
  "filterLeaves": {
    "name": "filterLeaves",
    "type": "Function",
    "signature": "filterLeaves&lt;T&gt;(graph: Graph&lt;T&gt;, predicate: LeafPredicate&lt;T&gt;): Node&lt;T&gt;[]",
    "description": "Filter leaves by predicate. Alias for findLeaves with simpler API.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to filter"},
      {"name": "predicate", "type": "LeafPredicate&lt;T&gt;", "description": "Filter function"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Filtered array of leaves",
    "example": "// Real-world: Getting active users\nimport { filterLeaves } from 'treep';\n\nconst active = filterLeaves(network, u => u.value.isActive);"
  },
  "filterLeavesByValue": {
    "name": "filterLeavesByValue",
    "type": "Function",
    "signature": "filterLeavesByValue&lt;T&gt;(graph: Graph&lt;T&gt;, value: T): Node&lt;T&gt;[]",
    "description": "Filter leaves by exact value match. Find all nodes with specific value.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to filter"},
      {"name": "value", "type": "T", "description": "Value to match"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Leaves with matching value",
    "example": "// Real-world: Finding all nodes with specific status\nimport { filterLeavesByValue } from 'treep';\n\nconst pending = filterLeavesByValue(tasks, { status: 'pending' });"
  },
  "filterBranches": {
    "name": "filterBranches",
    "type": "Function",
    "signature": "filterBranches&lt;T&gt;(graph: Graph&lt;T&gt;, predicate: BranchPredicate&lt;T&gt;): Branch&lt;T&gt;[]",
    "description": "Filter branches by predicate.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to filter"},
      {"name": "predicate", "type": "BranchPredicate&lt;T&gt;", "description": "Filter function"}
    ],
    "returns": "Branch&lt;T&gt;[]",
    "returnsDescription": "Filtered array of branches",
    "example": "// Real-world: Getting all paid routes\nimport { filterBranches } from 'treep';\n\nconst paidRoutes = filterBranches(map, r => r.value.requiresPayment);"
  },
  "filterBranchesByWeight": {
    "name": "filterBranchesByWeight",
    "type": "Function",
    "signature": "filterBranchesByWeight&lt;T&gt;(graph: Graph&lt;T&gt;, minWeight: number): Branch&lt;T&gt;[]",
    "description": "Filter branches by minimum weight. Find all edges above a threshold.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to filter"},
      {"name": "minWeight", "type": "number", "description": "Minimum weight threshold"}
    ],
    "returns": "Branch&lt;T&gt;[]",
    "returnsDescription": "Branches with weight >= minWeight",
    "example": "// Real-world: Finding expensive routes\nimport { filterBranchesByWeight } from 'treep';\n\nconst expensive = filterBranchesByWeight(map, 50); // Routes over 50 miles"
  },
  
  // ========== UTILITIES - SUBGRAPH ==========
  "extractSubgraph": {
    "name": "extractSubgraph",
    "type": "Function",
    "signature": "extractSubgraph&lt;T&gt;(graph: Graph&lt;T&gt;, leaves: Node&lt;T&gt;[], options?: SubgraphOptions): Graph&lt;T&gt;",
    "description": "Extract a subgraph containing specified leaves and their connections. Create focused views of large graphs.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Source graph"},
      {"name": "leaves", "type": "Node&lt;T&gt;[]", "description": "Leaves to include"},
      {"name": "options", "type": "SubgraphOptions", "optional": true, "description": "Extraction options"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "New graph containing specified leaves and connections",
    "example": "// Real-world: Creating a local network view\nimport { extractSubgraph } from 'treep';\n\nconst localUsers = [user1, user2, user3];\nconst localNetwork = extractSubgraph(globalNetwork, localUsers);\n// Contains only these users and connections between them"
  },
  "extractReachableSubgraph": {
    "name": "extractReachableSubgraph",
    "type": "Function",
    "signature": "extractReachableSubgraph&lt;T&gt;(graph: Graph&lt;T&gt;, start: Node&lt;T&gt;): Graph&lt;T&gt;",
    "description": "Extract subgraph of all reachable nodes from a starting node. Get everything connected to a node.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Source graph"},
      {"name": "start", "type": "Node&lt;T&gt;", "description": "Starting leaf"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "Subgraph of all reachable nodes",
    "example": "// Real-world: Getting user's entire friend network\nimport { extractReachableSubgraph } from 'treep';\n\nconst myNetwork = extractReachableSubgraph(socialNetwork, currentUser);\n// Contains all users reachable from current user"
  },
  
  // ========== UTILITIES - EXPORT FORMATS ==========
  "toDOT": {
    "name": "toDOT",
    "type": "Function",
    "signature": "toDOT&lt;T&gt;(graph: Graph&lt;T&gt;, options?: { directed?: boolean; includeWeights?: boolean }): string",
    "description": "Export graph to DOT format (Graphviz). Generate visualizations or import into graph tools.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to export"},
      {"name": "options", "type": "{ directed?: boolean; includeWeights?: boolean }", "optional": true, "description": "Export options"}
    ],
    "returns": "string",
    "returnsDescription": "DOT format string",
    "example": "// Real-world: Generating graph visualization\nimport { toDOT } from 'treep';\n\nconst dot = toDOT(network, { directed: true, includeWeights: true });\nfs.writeFileSync('network.dot', dot);\n// Use with: dot -Tpng network.dot -o network.png"
  },
  "toAdjacencyList": {
    "name": "toAdjacencyList",
    "type": "Function",
    "signature": "toAdjacencyList&lt;T&gt;(graph: Graph&lt;T&gt;): Record&lt;string, string[]&gt;",
    "description": "Export graph to adjacency list format. Common format for graph algorithms and storage.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to export"}
    ],
    "returns": "Record&lt;string, string[]&gt;",
    "returnsDescription": "Adjacency list object",
    "example": "// Real-world: Exporting for external graph library\nimport { toAdjacencyList } from 'treep';\n\nconst adjList = toAdjacencyList(graph);\n// { 'a': ['b', 'c'], 'b': ['a'] }"
  },
  "toEdgeList": {
    "name": "toEdgeList",
    "type": "Function",
    "signature": "toEdgeList&lt;T&gt;(graph: Graph&lt;T&gt;): Array&lt;{ from: string; to: string; weight?: number }&gt;",
    "description": "Export graph to edge list format. Simple format listing all connections.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to export"}
    ],
    "returns": "Array&lt;{ from: string; to: string; weight?: number }&gt;",
    "returnsDescription": "Array of edge objects",
    "example": "// Real-world: CSV export of connections\nimport { toEdgeList } from 'treep';\n\nconst edges = toEdgeList(graph);\nconst csv = edges.map(e => `${e.from},${e.to},${e.weight || ''}`).join('\\n');"
  },
  "toAdjacencyMatrix": {
    "name": "toAdjacencyMatrix",
    "type": "Function",
    "signature": "toAdjacencyMatrix&lt;T&gt;(graph: Graph&lt;T&gt;): number[][]",
    "description": "Export graph to adjacency matrix format. Matrix representation for mathematical operations.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "The graph to export"}
    ],
    "returns": "number[][]",
    "returnsDescription": "2D matrix where matrix[i][j] = 1 if edge exists, 0 otherwise",
    "example": "// Real-world: Matrix operations on graph\nimport { toAdjacencyMatrix } from 'treep';\n\nconst matrix = toAdjacencyMatrix(graph);\n// Use for matrix multiplication, eigenvalues, etc."
  },
  
  // ========== UTILITIES - TRANSFORMATIONS ==========
  "reverseGraph": {
    "name": "reverseGraph",
    "type": "Function",
    "signature": "reverseGraph&lt;T&gt;(graph: Graph&lt;T&gt;): Graph&lt;T&gt;",
    "description": "Create a new graph with all branches reversed. Useful for finding incoming connections or reversing flow.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Source graph"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "New graph with reversed edges",
    "example": "// Real-world: Finding who follows a user (reverse of following)\nimport { reverseGraph } from 'treep';\n\nconst reversed = reverseGraph(followingGraph);\n// Now edges point from followers to followees"
  },
  "transpose": {
    "name": "transpose",
    "type": "Function",
    "signature": "transpose&lt;T&gt;(graph: Graph&lt;T&gt;): Graph&lt;T&gt;",
    "description": "Create the transpose (reverse) of a directed graph. Alias for reverseGraph.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Source graph"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "Transposed graph",
    "example": "// Real-world: Reversing dependency direction\nimport { transpose } from 'treep';\n\nconst dependents = transpose(dependencies);\n// Shows what depends on each package"
  },
  "toUndirected": {
    "name": "toUndirected",
    "type": "Function",
    "signature": "toUndirected&lt;T&gt;(graph: Graph&lt;T&gt;): Graph&lt;T&gt;",
    "description": "Convert a directed graph to undirected. Make all connections bidirectional.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Source directed graph"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "Undirected graph",
    "example": "// Real-world: Making friendship network bidirectional\nimport { toUndirected } from 'treep';\n\nconst undirected = toUndirected(followingGraph);\n// All connections are now mutual"
  },
  "normalize": {
    "name": "normalize",
    "type": "Function",
    "signature": "normalize&lt;T&gt;(graph: Graph&lt;T&gt;, options?: NormalizeOptions): Graph&lt;T&gt;",
    "description": "Normalize graph structure. Remove duplicates, clean up structure.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Graph to normalize"},
      {"name": "options", "type": "NormalizeOptions", "optional": true, "description": "Normalization options"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "Normalized graph",
    "example": "// Real-world: Cleaning imported graph data\nimport { normalize } from 'treep';\n\nconst clean = normalize(importedGraph);\n// Removes duplicate edges, fixes structure"
  },
  "mergeGraph": {
    "name": "mergeGraph",
    "type": "Function",
    "signature": "mergeGraph&lt;T&gt;(graph1: Graph&lt;T&gt;, graph2: Graph&lt;T&gt;, options?: MergeGraphOptions&lt;T&gt;): Graph&lt;T&gt;",
    "description": "Merge two graphs into one. Combine separate networks or datasets.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph1", "type": "Graph&lt;T&gt;", "description": "First graph"},
      {"name": "graph2", "type": "Graph&lt;T&gt;", "description": "Second graph"},
      {"name": "options", "type": "MergeGraphOptions&lt;T&gt;", "optional": true, "description": "Merge options"}
    ],
    "returns": "Graph&lt;T&gt;",
    "returnsDescription": "Merged graph",
    "example": "// Real-world: Combining multiple social networks\nimport { mergeGraph } from 'treep';\n\nconst combined = mergeGraph(facebookNetwork, twitterNetwork);\n// Unified network with all users and connections"
  },
  "renderASCII": {
    "name": "renderASCII",
    "type": "Function",
    "signature": "renderASCII&lt;T&gt;(graph: Graph&lt;T&gt;, root?: Node&lt;T&gt;, options?: RenderOptions): string",
    "description": "Render graph as ASCII tree visualization. Perfect for debugging, logs, or terminal output.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Graph to render"},
      {"name": "root", "type": "Node&lt;T&gt;", "optional": true, "description": "Root node for tree view"},
      {"name": "options", "type": "RenderOptions", "optional": true, "description": "Rendering options"}
    ],
    "returns": "string",
    "returnsDescription": "ASCII tree string",
    "example": "// Real-world: Debugging graph structure\nimport { renderASCII } from 'treep';\n\nconsole.log(renderASCII(orgChart, ceo));\n// Outputs:\n// CEO\n// ├── CTO\n// │   ├── Engineer 1\n// │   └── Engineer 2\n// └── CFO"
  },
  
  // ========== UTILITIES - VALIDATION ==========
  "validate": {
    "name": "validate",
    "type": "Function",
    "signature": "validate&lt;T&gt;(value: T, schema: Schema): ValidationResult",
    "description": "Validate a value against a schema. Ensure data matches expected structure.",
    "since": "1.0.0",
    "arguments": [
      {"name": "value", "type": "T", "description": "Value to validate"},
      {"name": "schema", "type": "Schema", "description": "Validation schema"}
    ],
    "returns": "ValidationResult",
    "returnsDescription": "Validation result with isValid and errors",
    "example": "// Real-world: Validating user input\nimport { validate } from 'treep';\n\nconst schema = { name: 'string', age: 'number' };\nconst result = validate(userData, schema);\nif (!result.isValid) {\n  console.error('Validation errors:', result.errors);\n}"
  },
  "validateLeaf": {
    "name": "validateLeaf",
    "type": "Function",
    "signature": "validateLeaf&lt;T&gt;(leaf: Node&lt;T&gt;, schema: Schema): ValidationResult",
    "description": "Validate a leaf's value against a schema.",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Leaf to validate"},
      {"name": "schema", "type": "Schema", "description": "Validation schema"}
    ],
    "returns": "ValidationResult",
    "returnsDescription": "Validation result",
    "example": "// Real-world: Validating node data\nimport { validateLeaf } from 'treep';\n\nconst result = validateLeaf(userNode, userSchema);"
  },
  "validateBranch": {
    "name": "validateBranch",
    "type": "Function",
    "signature": "validateBranch&lt;T&gt;(branch: Branch&lt;T&gt;, schema: Schema): ValidationResult",
    "description": "Validate a branch against a schema.",
    "since": "1.0.0",
    "arguments": [
      {"name": "branch", "type": "Branch&lt;T&gt;", "description": "Branch to validate"},
      {"name": "schema", "type": "Schema", "description": "Validation schema"}
    ],
    "returns": "ValidationResult",
    "returnsDescription": "Validation result",
    "example": "// Real-world: Validating edge properties\nimport { validateBranch } from 'treep';\n\nconst result = validateBranch(connection, connectionSchema);"
  },
  "validateGraph": {
    "name": "validateGraph",
    "type": "Function",
    "signature": "validateGraph&lt;T&gt;(graph: Graph&lt;T&gt;, schema: Schema): ValidationResult",
    "description": "Validate all leaves in a graph against a schema.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Graph to validate"},
      {"name": "schema", "type": "Schema", "description": "Validation schema"}
    ],
    "returns": "ValidationResult",
    "returnsDescription": "Validation result for entire graph",
    "example": "// Real-world: Validating entire network\nimport { validateGraph } from 'treep';\n\nconst result = validateGraph(network, userSchema);\nif (result.isValid) {\n  console.log('All users are valid');\n}"
  },
  "validateTree": {
    "name": "validateTree",
    "type": "Function",
    "signature": "validateTree&lt;T&gt;(graph: Graph&lt;T&gt;): ValidationResult",
    "description": "Validate that a graph is a valid tree structure (no cycles, single root, connected).",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Graph to validate"}
    ],
    "returns": "ValidationResult",
    "returnsDescription": "Validation result",
    "example": "// Real-world: Ensuring org chart is valid tree\nimport { validateTree } from 'treep';\n\nconst result = validateTree(orgChart);\nif (!result.isValid) {\n  console.error('Invalid tree structure:', result.errors);\n}"
  },
  
  // ========== UTILITIES - TREE OPERATIONS ==========
  "findRoot": {
    "name": "findRoot",
    "type": "Function",
    "signature": "findRoot&lt;T&gt;(graph: Graph&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Find the root node of a tree. The node with no incoming edges.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Tree graph"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Root node or null if not a tree",
    "example": "// Real-world: Finding CEO in org chart\nimport { findRoot } from 'treep';\n\nconst ceo = findRoot(orgChart);\nif (ceo) {\n  console.log(`CEO: ${ceo.value.name}`);\n}"
  },
  "isRoot": {
    "name": "isRoot",
    "type": "Function",
    "signature": "isRoot&lt;T&gt;(leaf: Node&lt;T&gt;): boolean",
    "description": "Check if a leaf is a root node (no incoming edges).",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Leaf to check"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if root, false otherwise",
    "example": "// Real-world: Checking if user is top-level\nimport { isRoot } from 'treep';\n\nif (isRoot(employee)) {\n  console.log('This is the CEO');\n}"
  },
  "getRoot": {
    "name": "getRoot",
    "type": "Function",
    "signature": "getRoot&lt;T&gt;(leaf: Node&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Get the root node from any leaf in a tree. Traverse up to find top.",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Any leaf in the tree"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Root node or null",
    "example": "// Real-world: Finding company root from any employee\nimport { getRoot } from 'treep';\n\nconst companyRoot = getRoot(anyEmployee);\nconsole.log(`Company: ${companyRoot.value.name}`);"
  },
  "getParent": {
    "name": "getParent",
    "type": "Function",
    "signature": "getParent&lt;T&gt;(leaf: Node&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Get the parent node of a leaf in a tree.",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Leaf to get parent of"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Parent node or null if root",
    "example": "// Real-world: Finding manager of employee\nimport { getParent } from 'treep';\n\nconst manager = getParent(employee);\nif (manager) {\n  console.log(`Manager: ${manager.value.name}`);\n}"
  },
  "getChildren": {
    "name": "getChildren",
    "type": "Function",
    "signature": "getChildren&lt;T&gt;(leaf: Node&lt;T&gt;): Node&lt;T&gt;[]",
    "description": "Get all children of a leaf in a tree.",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Parent leaf"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of child nodes",
    "example": "// Real-world: Getting direct reports\nimport { getChildren } from 'treep';\n\nconst team = getChildren(manager);\nconsole.log(`Team size: ${team.length}`);"
  },
  "getSiblings": {
    "name": "getSiblings",
    "type": "Function",
    "signature": "getSiblings&lt;T&gt;(leaf: Node&lt;T&gt;): Node&lt;T&gt;[]",
    "description": "Get all sibling nodes (nodes with same parent).",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Leaf to get siblings of"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of sibling nodes",
    "example": "// Real-world: Finding coworkers at same level\nimport { getSiblings } from 'treep';\n\nconst coworkers = getSiblings(employee);\nconsole.log(`Coworkers: ${coworkers.map(e => e.value.name).join(', ')}`);"
  },
  "getAncestors": {
    "name": "getAncestors",
    "type": "Function",
    "signature": "getAncestors&lt;T&gt;(leaf: Node&lt;T&gt;): Node&lt;T&gt;[]",
    "description": "Get all ancestor nodes (parent, grandparent, etc.) up to root.",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Leaf to get ancestors of"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of ancestors from parent to root",
    "example": "// Real-world: Getting management chain\nimport { getAncestors } from 'treep';\n\nconst chain = getAncestors(employee);\n// [directManager, departmentHead, VP, CEO]"
  },
  "getDescendants": {
    "name": "getDescendants",
    "type": "Function",
    "signature": "getDescendants&lt;T&gt;(leaf: Node&lt;T&gt;): Node&lt;T&gt;[]",
    "description": "Get all descendant nodes (children, grandchildren, etc.).",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Leaf to get descendants of"}
    ],
    "returns": "Node&lt;T&gt;[]",
    "returnsDescription": "Array of all descendants",
    "example": "// Real-world: Getting entire team under manager\nimport { getDescendants } from 'treep';\n\nconst entireTeam = getDescendants(manager);\nconsole.log(`Total team size: ${entireTeam.length}`);"
  },
  "getHeight": {
    "name": "getHeight",
    "type": "Function",
    "signature": "getHeight&lt;T&gt;(leaf: Node&lt;T&gt;): number",
    "description": "Get the height of a subtree rooted at a leaf. Height is longest path to a leaf.",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Root of subtree"}
    ],
    "returns": "number",
    "returnsDescription": "Height of subtree",
    "example": "// Real-world: Measuring org chart depth\nimport { getHeight } from 'treep';\n\nconst depth = getHeight(ceo);\nconsole.log(`Organization depth: ${depth} levels`);"
  },
  "getDepth": {
    "name": "getDepth",
    "type": "Function",
    "signature": "getDepth&lt;T&gt;(leaf: Node&lt;T&gt;): number",
    "description": "Get the depth of a leaf in a tree (distance from root).",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Leaf to measure"}
    ],
    "returns": "number",
    "returnsDescription": "Depth from root (0 for root)",
    "example": "// Real-world: Finding employee level\nimport { getDepth } from 'treep';\n\nconst level = getDepth(employee);\nconsole.log(`Employee level: ${level}`);"
  },
  "getTreeSize": {
    "name": "getTreeSize",
    "type": "Function",
    "signature": "getTreeSize&lt;T&gt;(leaf: Node&lt;T&gt;): number",
    "description": "Get the size (number of nodes) of a subtree.",
    "since": "1.0.0",
    "arguments": [
      {"name": "leaf", "type": "Node&lt;T&gt;", "description": "Root of subtree"}
    ],
    "returns": "number",
    "returnsDescription": "Number of nodes in subtree",
    "example": "// Real-world: Counting team members\nimport { getTreeSize } from 'treep';\n\nconst teamSize = getTreeSize(manager);\nconsole.log(`Team has ${teamSize} members`);"
  },
  "getWidth": {
    "name": "getWidth",
    "type": "Function",
    "signature": "getWidth&lt;T&gt;(graph: Graph&lt;T&gt;): number",
    "description": "Get the maximum width (nodes at a level) of a tree.",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Tree graph"}
    ],
    "returns": "number",
    "returnsDescription": "Maximum width",
    "example": "// Real-world: Finding widest level in org\nimport { getWidth } from 'treep';\n\nconst maxWidth = getWidth(orgChart);\nconsole.log(`Widest level has ${maxWidth} employees`);"
  },
  "isTree": {
    "name": "isTree",
    "type": "Function",
    "signature": "isTree&lt;T&gt;(graph: Graph&lt;T&gt;): boolean",
    "description": "Check if a graph is a valid tree (no cycles, connected, single root).",
    "since": "1.0.0",
    "arguments": [
      {"name": "graph", "type": "Graph&lt;T&gt;", "description": "Graph to check"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if valid tree",
    "example": "// Real-world: Validating org chart structure\nimport { isTree } from 'treep';\n\nif (isTree(orgChart)) {\n  console.log('Valid org chart');\n} else {\n  console.error('Invalid: has cycles or multiple roots');\n}"
  },
  "isBST": {
    "name": "isBST",
    "type": "Function",
    "signature": "isBST&lt;T&gt;(root: Node&lt;T&gt;, compareFn: CompareFn&lt;T&gt;): boolean",
    "description": "Check if a tree is a valid Binary Search Tree. All left children < root < all right children.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root of tree"},
      {"name": "compareFn", "type": "CompareFn&lt;T&gt;", "description": "Comparison function"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if valid BST",
    "example": "// Real-world: Validating sorted data structure\nimport { isBST } from 'treep';\n\nconst compare = (a, b) => a.value - b.value;\nif (isBST(tree, compare)) {\n  console.log('Tree is properly sorted');\n}"
  },
  "isBalanced": {
    "name": "isBalanced",
    "type": "Function",
    "signature": "isBalanced&lt;T&gt;(root: Node&lt;T&gt;): boolean",
    "description": "Check if a tree is balanced (heights of left and right subtrees differ by at most 1).",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root of tree"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if balanced",
    "example": "// Real-world: Checking tree health\nimport { isBalanced } from 'treep';\n\nif (!isBalanced(tree)) {\n  console.warn('Tree is unbalanced, consider rebalancing');\n}"
  },
  "isComplete": {
    "name": "isComplete",
    "type": "Function",
    "signature": "isComplete&lt;T&gt;(root: Node&lt;T&gt;): boolean",
    "description": "Check if a tree is complete (all levels filled except possibly last, filled left to right).",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root of tree"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if complete",
    "example": "// Real-world: Validating heap structure\nimport { isComplete } from 'treep';\n\nif (isComplete(heap)) {\n  console.log('Valid heap structure');\n}"
  },
  "isFull": {
    "name": "isFull",
    "type": "Function",
    "signature": "isFull&lt;T&gt;(root: Node&lt;T&gt;): boolean",
    "description": "Check if a tree is full (every node has 0 or 2 children).",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root of tree"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if full",
    "example": "// Real-world: Validating binary tree structure\nimport { isFull } from 'treep';\n\nif (isFull(tree)) {\n  console.log('Tree is full binary tree');\n}"
  },
  "isPerfect": {
    "name": "isPerfect",
    "type": "Function",
    "signature": "isPerfect&lt;T&gt;(root: Node&lt;T&gt;): boolean",
    "description": "Check if a tree is perfect (all internal nodes have 2 children, all leaves at same level).",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root of tree"}
    ],
    "returns": "boolean",
    "returnsDescription": "True if perfect",
    "example": "// Real-world: Validating perfect binary tree\nimport { isPerfect } from 'treep';\n\nif (isPerfect(tree)) {\n  console.log('Perfect binary tree');\n}"
  },
  
  // ========== BINARY SEARCH TREE OPERATIONS ==========
  "bstInsert": {
    "name": "bstInsert",
    "type": "Function",
    "signature": "bstInsert&lt;T&gt;(root: Node&lt;T&gt; | null, value: T, compareFn: CompareFn&lt;T&gt;): Node&lt;T&gt;",
    "description": "Insert a value into a Binary Search Tree maintaining order.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt; | null", "description": "Root of BST"},
      {"name": "value", "type": "T", "description": "Value to insert"},
      {"name": "compareFn", "type": "CompareFn&lt;T&gt;", "description": "Comparison function"}
    ],
    "returns": "Node&lt;T&gt;",
    "returnsDescription": "Root of updated tree",
    "example": "// Real-world: Building sorted index\nimport { bstInsert } from 'treep';\n\nlet bst = null;\nconst compare = (a, b) => a.id - b.id;\n\nusers.forEach(user => {\n  bst = bstInsert(bst, user, compare);\n});\n// Tree is now sorted by user ID"
  },
  "bstSearch": {
    "name": "bstSearch",
    "type": "Function",
    "signature": "bstSearch&lt;T&gt;(root: Node&lt;T&gt; | null, value: T, compareFn: CompareFn&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Search for a value in a Binary Search Tree. O(log n) average case.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt; | null", "description": "Root of BST"},
      {"name": "value", "type": "T", "description": "Value to find"},
      {"name": "compareFn", "type": "CompareFn&lt;T&gt;", "description": "Comparison function"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Node with value or null",
    "example": "// Real-world: Fast lookup in sorted data\nimport { bstSearch } from 'treep';\n\nconst node = bstSearch(bst, targetValue, compare);\nif (node) {\n  console.log('Found:', node.value);\n}"
  },
  "bstMin": {
    "name": "bstMin",
    "type": "Function",
    "signature": "bstMin&lt;T&gt;(root: Node&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Find the minimum value node in a BST (leftmost node).",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root of BST"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Minimum node or null",
    "example": "// Real-world: Finding smallest value\nimport { bstMin } from 'treep';\n\nconst min = bstMin(bst);\nconsole.log('Minimum:', min.value);"
  },
  "bstMax": {
    "name": "bstMax",
    "type": "Function",
    "signature": "bstMax&lt;T&gt;(root: Node&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Find the maximum value node in a BST (rightmost node).",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt;", "description": "Root of BST"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Maximum node or null",
    "example": "// Real-world: Finding largest value\nimport { bstMax } from 'treep';\n\nconst max = bstMax(bst);\nconsole.log('Maximum:', max.value);"
  },
  "bstSuccessor": {
    "name": "bstSuccessor",
    "type": "Function",
    "signature": "bstSuccessor&lt;T&gt;(node: Node&lt;T&gt;, compareFn: CompareFn&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Find the successor of a node in a BST (next larger value).",
    "since": "1.0.0",
    "arguments": [
      {"name": "node", "type": "Node&lt;T&gt;", "description": "Node to find successor of"},
      {"name": "compareFn", "type": "CompareFn&lt;T&gt;", "description": "Comparison function"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Successor node or null",
    "example": "// Real-world: Finding next item in sorted order\nimport { bstSuccessor } from 'treep';\n\nconst next = bstSuccessor(currentNode, compare);\nif (next) {\n  console.log('Next:', next.value);\n}"
  },
  "bstPredecessor": {
    "name": "bstPredecessor",
    "type": "Function",
    "signature": "bstPredecessor&lt;T&gt;(node: Node&lt;T&gt;, compareFn: CompareFn&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Find the predecessor of a node in a BST (next smaller value).",
    "since": "1.0.0",
    "arguments": [
      {"name": "node", "type": "Node&lt;T&gt;", "description": "Node to find predecessor of"},
      {"name": "compareFn", "type": "CompareFn&lt;T&gt;", "description": "Comparison function"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Predecessor node or null",
    "example": "// Real-world: Finding previous item in sorted order\nimport { bstPredecessor } from 'treep';\n\nconst prev = bstPredecessor(currentNode, compare);"
  },
  "bstDelete": {
    "name": "bstDelete",
    "type": "Function",
    "signature": "bstDelete&lt;T&gt;(root: Node&lt;T&gt; | null, value: T, compareFn: CompareFn&lt;T&gt;): Node&lt;T&gt; | null",
    "description": "Delete a value from a Binary Search Tree maintaining order.",
    "since": "1.0.0",
    "arguments": [
      {"name": "root", "type": "Node&lt;T&gt; | null", "description": "Root of BST"},
      {"name": "value", "type": "T", "description": "Value to delete"},
      {"name": "compareFn", "type": "CompareFn&lt;T&gt;", "description": "Comparison function"}
    ],
    "returns": "Node&lt;T&gt; | null",
    "returnsDescription": "Root of updated tree",
    "example": "// Real-world: Removing item from sorted collection\nimport { bstDelete } from 'treep';\n\nbst = bstDelete(bst, valueToRemove, compare);\n// Tree remains sorted after deletion"
  },
  
  // ========== ERROR CLASSES ==========
  "TreepError": {
    "name": "TreepError",
    "type": "Class",
    "signature": "TreepError",
    "description": "Base error class for all Treep errors. Extends Error with additional context.",
    "since": "1.0.0",
    "example": "// Real-world: Catching and handling Treep errors\nimport { TreepError } from 'treep';\n\ntry {\n  graph.addLeaf(value, id);\n} catch (error) {\n  if (error instanceof TreepError) {\n    console.error('Treep error:', error.message, error.code);\n  }\n}"
  },
  "GraphError": {
    "name": "GraphError",
    "type": "Class",
    "signature": "GraphError",
    "description": "Error thrown for graph-related operations. Includes error code and context.",
    "since": "1.0.0",
    "example": "// Real-world: Handling graph operation errors\nimport { GraphError } from 'treep';\n\ntry {\n  graph.addBranch(invalidLeaf, otherLeaf);\n} catch (error) {\n  if (error instanceof GraphError) {\n    console.error(`Graph error [${error.code}]:`, error.message);\n  }\n}"
  },
  "TreeError": {
    "name": "TreeError",
    "type": "Class",
    "signature": "TreeError",
    "description": "Error thrown for tree-related operations.",
    "since": "1.0.0",
    "example": "// Real-world: Handling tree operation errors\nimport { TreeError } from 'treep';\n\ntry {\n  getParent(orphanNode);\n} catch (error) {\n  if (error instanceof TreeError) {\n    console.error('Tree error:', error.message);\n  }\n}"
  },
  "ValidationError": {
    "name": "ValidationError",
    "type": "Class",
    "signature": "ValidationError",
    "description": "Error thrown for validation failures. Contains detailed validation errors.",
    "since": "1.0.0",
    "example": "// Real-world: Handling validation errors\nimport { ValidationError } from 'treep';\n\ntry {\n  validateGraph(graph, schema);\n} catch (error) {\n  if (error instanceof ValidationError) {\n    error.errors.forEach(err => {\n      console.error(`Validation failed: ${err.path} - ${err.message}`);\n    });\n  }\n}"
  },
  "TypeError": {
    "name": "TypeError",
    "type": "Class",
    "signature": "TypeError",
    "description": "Error thrown for type-related issues in Treep operations.",
    "since": "1.0.0",
    "example": "// Real-world: Handling type errors\nimport { TypeError } from 'treep';\n\ntry {\n  // Type mismatch operation\n} catch (error) {\n  if (error instanceof TypeError) {\n    console.error('Type error:', error.message);\n  }\n}"
  }
};
