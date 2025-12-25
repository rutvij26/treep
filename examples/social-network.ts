import { Graph, BFS, shortestPath } from '../src';

interface User {
  name: string;
  age: number;
  city: string;
}

// Create a social network graph
const socialNetwork = new Graph<User>();

// Add users (leaves)
const alice = socialNetwork.addLeaf({ name: 'Alice', age: 30, city: 'NYC' }, 'alice');
const bob = socialNetwork.addLeaf({ name: 'Bob', age: 25, city: 'SF' }, 'bob');
const charlie = socialNetwork.addLeaf({ name: 'Charlie', age: 35, city: 'NYC' }, 'charlie');
const diana = socialNetwork.addLeaf({ name: 'Diana', age: 28, city: 'LA' }, 'diana');

// Add connections (branches)
socialNetwork.addBranch(alice, bob);
socialNetwork.addBranch(bob, charlie);
socialNetwork.addBranch(alice, diana);
socialNetwork.addBranch(charlie, diana);

// BFS traversal to find all connections
console.log('BFS Traversal:');
BFS(alice, (leaf) => {
  console.log(`  - ${leaf.value.name} (${leaf.value.city})`);
});

// Find shortest path between two users
console.log('\nShortest path from Alice to Charlie:');
const path = shortestPath(alice, charlie);
path.forEach((leaf, index) => {
  if (index > 0) process.stdout.write(' -> ');
  process.stdout.write(leaf.value.name);
});
console.log();

// Display network statistics
console.log(`\nNetwork Statistics:`);
console.log(`  Total users: ${socialNetwork.size()}`);
console.log(`  Total connections: ${socialNetwork.branchCount()}`);

