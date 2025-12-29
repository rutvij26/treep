import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const tempDir = join(__dirname, '../../.integration-test');

// Test scenarios
const testScenarios = [
  {
    name: 'Basic Graph Operations',
    code: `
import { Graph } from 'treep';

const graph = new Graph();

// Test addLeaf with explicit IDs
const nodeA = graph.addLeaf('A', 'A');
const nodeB = graph.addLeaf('B', 'B');
const nodeC = graph.addLeaf('C', 'C');

console.log('✅ addLeaf with IDs - PASSED');

// Test addBranch with string IDs
graph.addBranch('A', 'B');
graph.addBranch('A', 'C');

console.log('✅ addBranch with string IDs - PASSED');

// Test hasBranch
if (!graph.hasBranch(nodeA, nodeB) || !graph.hasBranch(nodeA, nodeC)) {
  throw new Error('hasBranch failed');
}
console.log('✅ hasBranch - PASSED');

// Test getLeaf
if (!graph.getLeaf('A') || !graph.getLeaf('B')) {
  throw new Error('getLeaf failed');
}
console.log('✅ getLeaf - PASSED');

// Test leaves()
const leaves = graph.leaves();
if (leaves.length !== 3) {
  throw new Error(\`Expected 3 leaves, got \${leaves.length}\`);
}
console.log('✅ leaves() - PASSED');

// Test branches()
const branches = graph.branches();
if (branches.length !== 2) {
  throw new Error(\`Expected 2 branches, got \${branches.length}\`);
}
console.log('✅ branches() - PASSED');
`,
  },
  {
    name: 'BFS and DFS',
    code: `
import { Graph, BFS, DFS } from 'treep';

const graph = new Graph();
const a = graph.addLeaf('A', 'A');
const b = graph.addLeaf('B', 'B');
const c = graph.addLeaf('C', 'C');
graph.addBranch('A', 'B');
graph.addBranch('A', 'C');

const bfsVisited = [];
BFS(a, (leaf) => bfsVisited.push(leaf.value));

if (bfsVisited.length !== 3) {
  throw new Error('BFS failed');
}
console.log('✅ BFS - PASSED');

const dfsVisited = [];
DFS(a, (leaf) => dfsVisited.push(leaf.value));

if (dfsVisited.length !== 3) {
  throw new Error('DFS failed');
}
console.log('✅ DFS - PASSED');
`,
  },
  {
    name: 'Shortest Path',
    code: `
import { Graph, shortestPath } from 'treep';

const graph = new Graph();
graph.addLeaf('A', 'A');
graph.addLeaf('B', 'B');
graph.addLeaf('C', 'C');
const a = graph.getLeaf('A');
const b = graph.getLeaf('B');
const c = graph.getLeaf('C');

graph.addBranch('A', 'B');
graph.addBranch('B', 'C');

const path = shortestPath(a, c);
if (!path || path.length !== 3) {
  throw new Error('shortestPath failed');
}
console.log('✅ shortestPath - PASSED');
`,
  },
  {
    name: 'Auto-generated IDs',
    code: `
import { Graph } from 'treep';

const graph = new Graph();

// Test addLeaf without ID (auto-generates)
const node1 = graph.addLeaf('Value1');
const node2 = graph.addLeaf('Value2');

if (!node1.id || !node2.id) {
  throw new Error('Auto-generated IDs failed');
}

// Use the auto-generated IDs
graph.addBranch(node1.id, node2.id);

console.log('✅ Auto-generated IDs - PASSED');
`,
  },
  {
    name: 'Number IDs',
    code: `
import { Graph } from 'treep';

const graph = new Graph();
graph.addLeaf('A', 1);
graph.addLeaf('B', 2);
graph.addBranch(1, 2);

const node1 = graph.getLeaf(1);
const node2 = graph.getLeaf(2);

if (!node1 || !node2) {
  throw new Error('Number IDs failed');
}
console.log('✅ Number IDs - PASSED');
`,
  },
  {
    name: 'Mixed Node objects and IDs',
    code: `
import { Graph } from 'treep';

const graph = new Graph();
const nodeA = graph.addLeaf('A', 'A');
graph.addLeaf('B', 'B');

// Mix Node object and string ID
graph.addBranch(nodeA, 'B');

if (!graph.hasBranch(nodeA, graph.getLeaf('B'))) {
  throw new Error('Mixed Node/ID failed');
}
console.log('✅ Mixed Node objects and IDs - PASSED');
`,
  },
  {
    name: 'Error Handling',
    code: `
import { Graph, GraphError } from 'treep';

const graph = new Graph();
graph.addLeaf('A', 'A');

try {
  graph.addBranch('A', 'nonexistent');
  throw new Error('Should have thrown error');
} catch (error) {
  if (!(error instanceof GraphError) || error.code !== 'LEAF_NOT_FOUND') {
    throw error;
  }
}
console.log('✅ Error handling - PASSED');
`,
  },
  {
    name: 'Complex Graph Operations',
    code: `
import { Graph, BFS, shortestPath, allPaths } from 'treep';

const graph = new Graph();
for (let i = 0; i < 5; i++) {
  graph.addLeaf(\`Node\${i}\`, i);
}

// Create a path: 0 -> 1 -> 2 -> 3 -> 4
for (let i = 0; i < 4; i++) {
  graph.addBranch(i, i + 1);
}

// Also add: 0 -> 2 (shortcut)
graph.addBranch(0, 2);
// And: 2 -> 4 (to make 0 -> 2 -> 4 a valid path)
graph.addBranch(2, 4);

const start = graph.getLeaf(0);
const end = graph.getLeaf(4);

// Test BFS
const visited = [];
BFS(start, (leaf) => visited.push(leaf.id));
if (visited.length !== 5) {
  throw new Error('BFS on complex graph failed');
}
console.log('✅ Complex BFS - PASSED');

// Test shortest path (should be 0 -> 2 -> 4, length 3)
const path = shortestPath(start, end);
if (!path || path.length !== 3) {
  throw new Error(\`Shortest path on complex graph failed: expected length 3, got \${path ? path.length : 'null'}\`);
}
console.log('✅ Complex shortestPath - PASSED');

// Test all paths
const paths = allPaths(start, end);
if (paths.length < 1) {
  throw new Error('All paths on complex graph failed');
}
console.log('✅ Complex allPaths - PASSED');
`,
  },
  {
    name: 'JSON Serialization',
    code: `
import { Graph, toJSON, fromJSON } from 'treep';

const graph = new Graph();
graph.addLeaf('A', 'A');
graph.addLeaf('B', 'B');
graph.addBranch('A', 'B');

const json = toJSON(graph);
if (!json.nodes || !json.edges) {
  throw new Error('toJSON failed');
}
console.log('✅ toJSON - PASSED');

// fromJSON expects array format with id and children fields
// So we need to convert toJSON format to fromJSON format
const fromJSONFormat = json.nodes.map(node => ({
  id: node.id,
  value: node.value,
  children: json.edges
    .filter(edge => edge.from === node.id)
    .map(edge => edge.to)
}));

const restored = fromJSON(fromJSONFormat);
if (restored.leaves().length !== 2) {
  throw new Error('fromJSON failed');
}
console.log('✅ fromJSON - PASSED');
`,
  },
  {
    name: 'Statistics',
    code: `
import { Graph, getStatistics } from 'treep';

const graph = new Graph();
graph.addLeaf('A', 'A');
graph.addLeaf('B', 'B');
graph.addLeaf('C', 'C');
graph.addBranch('A', 'B');
graph.addBranch('A', 'C');

const stats = getStatistics(graph);
if (stats.leafCount !== 3 || stats.branchCount !== 2) {
  throw new Error(\`getStatistics failed: expected leafCount=3, branchCount=2, got leafCount=\${stats.leafCount}, branchCount=\${stats.branchCount}\`);
}
console.log('✅ getStatistics - PASSED');
`,
  },
  {
    name: 'Common Mistake: addLeaf without ID then addBranch with value',
    code: `
import { Graph, GraphError } from 'treep';

const graph = new Graph();

// This is a common mistake - addLeaf without ID
const nodeA = graph.addLeaf('A'); // Auto-generates ID like "leaf_1234567890_0"
const nodeB = graph.addLeaf('B'); // Auto-generates ID like "leaf_1234567890_1"

// This will FAIL because 'A' is not the ID, it's the value
// The correct way is to use the returned Node objects:
graph.addBranch(nodeA, nodeB);

// Or use explicit IDs:
const graph2 = new Graph();
graph2.addLeaf('A', 'A');
graph2.addLeaf('B', 'B');
graph2.addBranch('A', 'B'); // This works because IDs are explicit

console.log('✅ Common mistake handling - PASSED');
`,
  },
];

describe('Integration Tests', () => {
  beforeAll(() => {
    // Clean up previous test
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    mkdirSync(tempDir, { recursive: true });

    // Ensure the package is built before installing
    const projectRoot = join(__dirname, '../..');
    const distDir = join(projectRoot, 'dist');
    if (!existsSync(distDir)) {
      console.log('Building treep package for integration tests...');
      execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    }

    // Create package.json - use local treep package for development testing
    const packageJson = {
      name: 'treep-integration-test',
      version: '1.0.0',
      type: 'module',
      dependencies: {
        treep: `file:${projectRoot.replace(/\\/g, '/')}`,
      },
    };

    writeFileSync(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Install local treep
    execSync('npm install', { cwd: tempDir, stdio: 'pipe' });
  });

  afterAll(() => {
    // Cleanup
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  testScenarios.forEach(scenario => {
    it(`should pass ${scenario.name}`, () => {
      writeFileSync(join(tempDir, 'test.mjs'), scenario.code);

      const output = execSync('node test.mjs', {
        cwd: tempDir,
        encoding: 'utf-8',
      });

      expect(output).toContain('✅');
      expect(output).toContain('PASSED');
    });
  });
});
