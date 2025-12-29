// Test importing using package.json exports (simulating real npm usage)
// We'll use a file: protocol to test locally
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tempDir = join(__dirname, '.test-link');

console.log('🧪 Testing package import via exports field...\n');

try {
  // Create temp directory
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  mkdirSync(tempDir, { recursive: true });

  // Create package.json that imports treep via file: protocol
  const testPackageJson = {
    name: 'test-treep',
    version: '1.0.0',
    type: 'module',
    dependencies: {
      treep: `file:${__dirname.replace(/\\/g, '/')}`,
    },
  };

  writeFileSync(join(tempDir, 'package.json'), JSON.stringify(testPackageJson, null, 2));

  // Create test file
  const testFile = `import { Graph, BFS, shortestPath, Node } from 'treep';

console.log('✅ Package Import Test (via exports field)');
console.log('Testing imports using package.json exports field...\\n');

const graph = new Graph();
const nodeA = graph.addLeaf('A', 'A');
const nodeB = graph.addLeaf('B', 'B');
const nodeC = graph.addLeaf('C', 'C');

console.log('✅ Test 1: Graph creation and addLeaf() - PASSED');

graph.addBranch(nodeA, nodeB);
graph.addBranch(nodeA, nodeC);

console.log('✅ Test 2: addBranch() - PASSED');

const visited = [];
BFS(nodeA, (leaf) => {
  visited.push(leaf.value);
});

if (visited.length === 3 && visited.includes('A') && visited.includes('B') && visited.includes('C')) {
  console.log('✅ Test 3: BFS traversal - PASSED');
} else {
  console.error('❌ Test 3: BFS traversal - FAILED');
  process.exit(1);
}

const path = shortestPath(nodeA, nodeC);
if (path && path.length === 2 && path[0].value === 'A' && path[1].value === 'C') {
  console.log('✅ Test 4: shortestPath() - PASSED');
} else {
  console.error('❌ Test 4: shortestPath() - FAILED');
  process.exit(1);
}

console.log('\\n🎉 All package import tests passed!');
`;

  writeFileSync(join(tempDir, 'test.mjs'), testFile);

  // Install dependencies
  console.log('Installing treep package (this may take a moment)...');
  const { execSync } = await import('child_process');
  execSync('npm install', { cwd: tempDir, stdio: 'inherit' });

  // Run test
  console.log('\nRunning import test via exports field...\n');
  execSync('node test.mjs', { cwd: tempDir, stdio: 'inherit' });

  // Cleanup
  rmSync(tempDir, { recursive: true, force: true });
  console.log('\n✅ Package import test completed successfully!');
} catch (error) {
  console.error('\n❌ Package import test failed:', error.message);
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  process.exit(1);
}
