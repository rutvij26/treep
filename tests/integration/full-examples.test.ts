import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const tempDir = join(__dirname, '../../.full-integration-test');

// Test cases - each will be a separate test file
const testCases = [
  {
    name: 'User Provided Example',
    file: 'user-example.mjs',
    code: `
import { Graph } from 'treep';

const graph = new Graph();

graph.addLeaf("A");
graph.addLeaf("B");
graph.addLeaf("C");

graph.addBranch("A", "B");
graph.addBranch("A", "C");

console.log('✅ User example - PASSED');
console.log(\`Graph has \${graph.leaves().length} leaves and \${graph.branches().length} branches\`);
`,
  },
  {
    name: 'Social Network Example',
    file: 'social-network.mjs',
    code: `
import { Graph, BFS, shortestPath } from 'treep';

const socialNetwork = new Graph();

const alice = socialNetwork.addLeaf({ name: 'Alice', age: 30, city: 'NYC' }, 'alice');
const bob = socialNetwork.addLeaf({ name: 'Bob', age: 25, city: 'SF' }, 'bob');
const charlie = socialNetwork.addLeaf({ name: 'Charlie', age: 35, city: 'NYC' }, 'charlie');
const diana = socialNetwork.addLeaf({ name: 'Diana', age: 28, city: 'LA' }, 'diana');

socialNetwork.addBranch(alice, bob);
socialNetwork.addBranch(bob, charlie);
socialNetwork.addBranch(alice, diana);
socialNetwork.addBranch(charlie, diana);

const visited = [];
BFS(alice, (leaf) => {
  visited.push(leaf.value.name);
});

if (visited.length !== 4) {
  throw new Error(\`BFS failed: expected 4, got \${visited.length}\`);
}

const path = shortestPath(alice, charlie);
if (!path || path.length !== 3) {
  throw new Error(\`Shortest path failed: expected length 3, got \${path ? path.length : 'null'}\`);
}

console.log('✅ Social network example - PASSED');
`,
  },
  {
    name: 'Supply Chain Example',
    file: 'supply-chain.mjs',
    code: `
import { Graph, shortestPath, renderASCII } from 'treep';

const supplyChain = new Graph();

const warehouse = supplyChain.addLeaf({ name: 'Main Warehouse', type: 'warehouse' }, 'warehouse');
const factory1 = supplyChain.addLeaf({ name: 'Factory A', type: 'factory' }, 'factory1');
const factory2 = supplyChain.addLeaf({ name: 'Factory B', type: 'factory' }, 'factory2');
const store1 = supplyChain.addLeaf({ name: 'Store Downtown', type: 'store' }, 'store1');
const store2 = supplyChain.addLeaf({ name: 'Store Uptown', type: 'store' }, 'store2');

supplyChain.addBranch(warehouse, factory1, 2);
supplyChain.addBranch(warehouse, factory2, 3);
supplyChain.addBranch(factory1, store1, 1);
supplyChain.addBranch(factory1, store2, 2);
supplyChain.addBranch(factory2, store1, 4);
supplyChain.addBranch(factory2, store2, 1);

const path = shortestPath(warehouse, store1, supplyChain.branches());
if (!path || path.length < 2) {
  throw new Error('Shortest path failed');
}

const ascii = renderASCII(supplyChain, warehouse);
if (!ascii || ascii.length === 0) {
  throw new Error('renderASCII failed');
}

console.log('✅ Supply chain example - PASSED');
`,
  },
  {
    name: 'Nested JSON Example',
    file: 'nested-json.mjs',
    code: `
import { Graph, fromJSON, normalize, validate } from 'treep';

const nestedData = {
  users: [
    {
      id: 1,
      name: 'Alice',
      age: '30',
      active: 'true',
      friends: [2, 3],
    },
    {
      id: 2,
      name: 'Bob',
      age: '25',
      active: 'false',
      friends: [1],
    },
    {
      id: 3,
      name: 'Charlie',
      age: '35',
      active: 'true',
      friends: [1, 2],
    },
  ],
};

const normalized = normalize(nestedData, {
  typeConversions: true,
  requiredFields: ['users'],
});

if (!normalized || !normalized.users) {
  throw new Error('normalize failed');
}

const graph = fromJSON(
  normalized.users,
  {
    idField: 'id',
    branchField: 'friends',
  }
);

if (graph.leaves().length !== 3) {
  throw new Error(\`fromJSON failed: expected 3 leaves, got \${graph.leaves().length}\`);
}

const schema = {
  name: { type: 'string', required: true, minLength: 1 },
  age: { type: 'number', required: true, min: 0 },
  active: { type: 'boolean', required: true },
};

let validCount = 0;
for (const leaf of graph.leaves()) {
  const result = validate(leaf.value, schema);
  if (result.isValid) {
    validCount++;
  }
}

if (validCount !== 3) {
  throw new Error(\`Validation failed: expected 3 valid, got \${validCount}\`);
}

console.log('✅ Nested JSON example - PASSED');
`,
  },
  {
    name: 'String Value as ID',
    file: 'string-id.mjs',
    code: `
import { Graph } from 'treep';

const graph = new Graph();

// When value is string/number and no ID provided, value is used as ID
const nodeA = graph.addLeaf("A");
const nodeB = graph.addLeaf("B");
const nodeC = graph.addLeaf("C");

// Verify IDs match values
if (nodeA.id !== "A" || nodeB.id !== "B" || nodeC.id !== "C") {
  throw new Error(\`Auto-ID failed: A=\${nodeA.id}, B=\${nodeB.id}, C=\${nodeC.id}\`);
}

// Now addBranch with string IDs should work
graph.addBranch("A", "B");
graph.addBranch("A", "C");

if (!graph.hasBranch(nodeA, nodeB) || !graph.hasBranch(nodeA, nodeC)) {
  throw new Error('addBranch with string IDs failed');
}

console.log('✅ String value as ID - PASSED');
`,
  },
  {
    name: 'Number Value as ID',
    file: 'number-id.mjs',
    code: `
import { Graph } from 'treep';

const graph = new Graph();

// When value is number and no ID provided, value is used as ID
const node1 = graph.addLeaf(1);
const node2 = graph.addLeaf(2);
const node3 = graph.addLeaf(3);

// Verify IDs match values
if (node1.id !== 1 || node2.id !== 2 || node3.id !== 3) {
  throw new Error(\`Auto-ID failed: 1=\${node1.id}, 2=\${node2.id}, 3=\${node3.id}\`);
}

// Now addBranch with number IDs should work
graph.addBranch(1, 2);
graph.addBranch(1, 3);

if (!graph.hasBranch(node1, node2) || !graph.hasBranch(node1, node3)) {
  throw new Error('addBranch with number IDs failed');
}

console.log('✅ Number value as ID - PASSED');
`,
  },
  {
    name: 'Object Value Auto-ID',
    file: 'object-id.mjs',
    code: `
import { Graph } from 'treep';

const graph = new Graph();

// When value is object and no ID provided, auto-generate ID
const node1 = graph.addLeaf({ name: 'Alice' });
const node2 = graph.addLeaf({ name: 'Bob' });

// Verify IDs are auto-generated (should start with 'leaf_')
if (typeof node1.id !== 'string' || !node1.id.startsWith('leaf_')) {
  throw new Error(\`Auto-ID failed for object: \${node1.id}\`);
}

if (typeof node2.id !== 'string' || !node2.id.startsWith('leaf_')) {
  throw new Error(\`Auto-ID failed for object: \${node2.id}\`);
}

// Use the auto-generated IDs
graph.addBranch(node1.id, node2.id);

if (!graph.hasBranch(node1, node2)) {
  throw new Error('addBranch with auto-generated IDs failed');
}

console.log('✅ Object value auto-ID - PASSED');
`,
  },
];

describe('Full Integration Tests', () => {
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
      name: 'treep-full-integration-test',
      version: '1.0.0',
      type: 'module',
      description: 'Full integration test for treep',
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

  testCases.forEach(testCase => {
    it(`should pass ${testCase.name}`, () => {
      writeFileSync(join(tempDir, testCase.file), testCase.code);

      const output = execSync(`node ${testCase.file}`, {
        cwd: tempDir,
        encoding: 'utf-8',
      });

      expect(output).toContain('✅');
      expect(output).toContain('PASSED');
    });
  });
});
