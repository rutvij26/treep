import { Graph, fromJSON, normalize, validate } from '../src';
import type { Schema } from '../src';

// Example nested JSON data
const nestedData = {
  users: [
    {
      id: 1,
      name: 'Alice',
      age: '30', // String that should be converted to number
      active: 'true', // String that should be converted to boolean
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

// Normalize the JSON (convert types, flatten structure)
console.log('Normalizing JSON...');
const normalized = normalize(nestedData, {
  typeConversions: true,
  requiredFields: ['users'],
});

console.log('Normalized data:', JSON.stringify(normalized, null, 2));

// Build graph from normalized JSON
console.log('\nBuilding graph from JSON...');
const graph = fromJSON(
  (normalized as { users: Array<{ id: number; name: string; friends: number[] }> }).users,
  {
    idField: 'id',
    branchField: 'friends',
  }
);

console.log(`Graph created with ${graph.size()} leaves and ${graph.branchCount()} branches`);

// Validate graph structure
const schema: Schema = {
  name: { type: 'string', required: true, minLength: 1 },
  age: { type: 'number', required: true, min: 0 },
  active: { type: 'boolean', required: true },
};

console.log('\nValidating leaves...');
for (const leaf of graph.leaves()) {
  const result = validate(leaf.value, schema);
  if (result.isValid) {
    console.log(`  ✓ ${(leaf.value as { name: string }).name} is valid`);
  } else {
    console.log(`  ✗ ${(leaf.value as { name: string }).name} has errors:`, result.errors);
  }
}

