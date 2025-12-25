import { Graph, shortestPath, renderASCII } from '../src';

interface Location {
  name: string;
  type: 'warehouse' | 'factory' | 'store';
}

// Create supply chain graph with weighted branches (delivery times)
const supplyChain = new Graph<Location>();

// Add locations (leaves)
const warehouse = supplyChain.addLeaf({ name: 'Main Warehouse', type: 'warehouse' }, 'warehouse');
const factory1 = supplyChain.addLeaf({ name: 'Factory A', type: 'factory' }, 'factory1');
const factory2 = supplyChain.addLeaf({ name: 'Factory B', type: 'factory' }, 'factory2');
const store1 = supplyChain.addLeaf({ name: 'Store Downtown', type: 'store' }, 'store1');
const store2 = supplyChain.addLeaf({ name: 'Store Uptown', type: 'store' }, 'store2');

// Add delivery routes with weights (delivery time in hours)
supplyChain.addBranch(warehouse, factory1, 2);
supplyChain.addBranch(warehouse, factory2, 3);
supplyChain.addBranch(factory1, store1, 1);
supplyChain.addBranch(factory1, store2, 2);
supplyChain.addBranch(factory2, store1, 4);
supplyChain.addBranch(factory2, store2, 1);

// Find shortest delivery path (weighted)
console.log('Shortest delivery path from Warehouse to Store Downtown:');
const path = shortestPath(warehouse, store1, supplyChain.branches());
const totalTime = path.reduce((sum, leaf, index) => {
  if (index < path.length - 1) {
    const branch = leaf.branches.find((b) => b.to === path[index + 1]);
    return sum + (branch?.weight ?? 0);
  }
  return sum;
}, 0);

path.forEach((leaf, index) => {
  if (index > 0) process.stdout.write(' -> ');
  process.stdout.write(leaf.value.name);
});
console.log(`\nTotal delivery time: ${totalTime} hours`);

// Visualize the supply chain
console.log('\nSupply Chain Visualization:');
console.log(renderASCII(supplyChain, warehouse));

