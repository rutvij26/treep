// Test importing from package (simulating npm install)
// This tests the exports field resolution
import { Graph, BFS, shortestPath, Node } from './index.js';

console.log('✅ Package Import Test (ESM)');
console.log('Testing imports using package.json exports field...\n');

// Test 1: Create graph and add leaves
const graph = new Graph();
const nodeA = graph.addLeaf('A', 'A');
const nodeB = graph.addLeaf('B', 'B');
const nodeC = graph.addLeaf('C', 'C');

console.log('✅ Test 1: Graph creation and addLeaf() - PASSED');

// Test 2: Add branches
graph.addBranch(nodeA, nodeB);
graph.addBranch(nodeA, nodeC);

console.log('✅ Test 2: addBranch() - PASSED');

// Test 3: BFS traversal
const visited = [];
BFS(nodeA, leaf => {
  visited.push(leaf.value);
});

if (
  visited.length === 3 &&
  visited.includes('A') &&
  visited.includes('B') &&
  visited.includes('C')
) {
  console.log('✅ Test 3: BFS traversal - PASSED');
} else {
  console.error('❌ Test 3: BFS traversal - FAILED');
  process.exit(1);
}

// Test 4: Shortest path
const path = shortestPath(nodeA, nodeC);
if (path && path.length === 2 && path[0].value === 'A' && path[1].value === 'C') {
  console.log('✅ Test 4: shortestPath() - PASSED');
} else {
  console.error('❌ Test 4: shortestPath() - FAILED');
  process.exit(1);
}

console.log('\n🎉 All package import tests passed!');
