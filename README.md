# Treep

[![npm version](https://badge.fury.io/js/treep.svg)](https://badge.fury.io/js/treep)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%23007ACC.svg)](http://www.typescriptlang.org/)

**Treep** is a lightweight, ultra-fast TypeScript library for **graph and tree data structures** with comprehensive traversal algorithms. It uses a clean tree metaphor throughout: **Node → Leaf**, **Edge → Branch**.

## Features

- 🌳 **Tree Metaphor**: Intuitive API using leaves and branches
- ⚡ **Ultra-Fast**: Optimized for large datasets (1M+ nodes)
- 🔒 **Type-Safe**: Full TypeScript generics with type inference
- 📦 **Zero Dependencies**: Pure TypeScript/JavaScript
- 🎯 **Framework-Agnostic**: Works in Node.js, browser, React, Vue, Angular, React Native
- 🚀 **Comprehensive**: BFS, DFS, shortest path, cycle detection, and more
- ✅ **Schema Validation**: Built-in validation with tree path notation

## Installation

```bash
npm install treep
```

## Quick Start

```typescript
import { Graph, BFS, shortestPath } from 'treep';

// Create a graph
const graph = new Graph<User>();

// Add leaves (nodes)
const alice = graph.addLeaf({ name: 'Alice', age: 30 }, 'alice');
const bob = graph.addLeaf({ name: 'Bob', age: 25 }, 'bob');
const charlie = graph.addLeaf({ name: 'Charlie', age: 35 }, 'charlie');

// Add branches (edges)
graph.addBranch(alice, bob);
graph.addBranch(bob, charlie);

// BFS traversal
const visited = BFS(alice, (leaf) => {
  console.log(leaf.value.name);
});

// Shortest path
const path = shortestPath(alice, charlie);
```

## Requirements

- **Node.js**: 20+ (LTS)
- **TypeScript**: 5.0+
- **Browsers**: Modern browsers only (Chrome, Edge, Firefox, Safari)

## Documentation

📚 **[View Full Documentation](./docs/index.html)** - Comprehensive guide with examples, API reference, and interactive code snippets.

See [examples](./examples/) for more usage examples.

## Author

**Rutvij Sathe**
- Website: https://rutvijsathe.dev
- GitHub: https://github.com/rutvij26

## License

MIT © Rutvij Sathe

