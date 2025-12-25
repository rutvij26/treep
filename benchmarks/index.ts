import Benchmark from 'benchmark';
import { Graph, Node, BFS, DFS, shortestPath, allPaths, lazyBFS, lazyDFS } from '../src';

// Helper to create a graph of a given size
function createGraph(size: number): { graph: Graph<number>; nodes: Node<number>[] } {
  const graph = new Graph<number>();
  const nodes: Node<number>[] = [];

  // Create nodes
  for (let i = 0; i < size; i++) {
    const node = graph.addLeaf(i, `node-${i}`);
    nodes.push(node);
  }

  // Create a connected graph (each node connects to next)
  for (let i = 0; i < size - 1; i++) {
    graph.addBranch(nodes[i], nodes[i + 1]);
  }

  // Add some cross-connections for a more complex graph
  for (let i = 0; i < Math.floor(size / 10); i++) {
    const from = Math.floor(Math.random() * size);
    const to = Math.floor(Math.random() * size);
    if (from !== to) {
      try {
        graph.addBranch(nodes[from], nodes[to]);
      } catch {
        // Ignore duplicate branches
      }
    }
  }

  return { graph, nodes };
}

// Benchmark suite
const suite = new Benchmark.Suite('Treep Performance Benchmarks');

// Small graph (100 nodes)
const smallGraph = createGraph(100);
const smallNodes = smallGraph.nodes;

suite
  .add('BFS - Small Graph (100 nodes)', () => {
    BFS(smallNodes[0], () => {});
  })
  .add('DFS - Small Graph (100 nodes)', () => {
    DFS(smallNodes[0], () => {});
  })
  .add('Shortest Path - Small Graph', () => {
    shortestPath(smallNodes[0], smallNodes[99]);
  })
  .add('All Paths - Small Graph', () => {
    allPaths(smallNodes[0], smallNodes[99]);
  });

// Medium graph (1000 nodes)
const mediumGraph = createGraph(1000);
const mediumNodes = mediumGraph.nodes;

suite
  .add('BFS - Medium Graph (1000 nodes)', () => {
    BFS(mediumNodes[0], () => {});
  })
  .add('DFS - Medium Graph (1000 nodes)', () => {
    DFS(mediumNodes[0], () => {});
  })
  .add('Shortest Path - Medium Graph', () => {
    shortestPath(mediumNodes[0], mediumNodes[999]);
  });

// Large graph (10000 nodes)
const largeGraph = createGraph(10000);
const largeNodes = largeGraph.nodes;

suite
  .add('BFS - Large Graph (10000 nodes)', () => {
    BFS(largeNodes[0], () => {});
  })
  .add('DFS - Large Graph (10000 nodes)', () => {
    DFS(largeNodes[0], () => {});
  })
  .add('Shortest Path - Large Graph', () => {
    shortestPath(largeNodes[0], largeNodes[9999]);
  });

// Graph operations
suite
  .add('Add Leaf - 1000 operations', () => {
    const g = new Graph<number>();
    for (let i = 0; i < 1000; i++) {
      g.addLeaf(i, `node-${i}`);
    }
  })
  .add('Add Branch - 1000 operations', () => {
    const g = new Graph<number>();
    const nodes: Node<number>[] = [];
    for (let i = 0; i < 1000; i++) {
      nodes.push(g.addLeaf(i, `node-${i}`));
    }
    for (let i = 0; i < 1000; i++) {
      if (i < nodes.length - 1) {
        g.addBranch(nodes[i], nodes[i + 1]);
      }
    }
  })
  .add('Get Leaf - 1000 operations', () => {
    const g = mediumGraph.graph;
    for (let i = 0; i < 1000; i++) {
      g.getLeaf(`node-${i % 1000}`);
    }
  });

// Lazy vs Non-Lazy Comparison
suite
  .add('BFS (eager) - Large Graph', () => {
    const result = BFS(largeNodes[0]);
    return result.length;
  })
  .add('BFS (lazy) - Large Graph', () => {
    let count = 0;
    for (const _ of lazyBFS(largeNodes[0])) {
      count++;
    }
    return count;
  })
  .add('DFS (eager) - Large Graph', () => {
    const result = DFS(largeNodes[0]);
    return result.length;
  })
  .add('DFS (lazy) - Large Graph', () => {
    let count = 0;
    for (const _ of lazyDFS(largeNodes[0])) {
      count++;
    }
    return count;
  });
// Skip All Paths for medium graphs - too slow/exponential complexity
// .add('All Paths (eager) - Medium Graph', () => {
//   const paths = allPaths(mediumNodes[0], mediumNodes[999]);
//   return paths.length;
// })
// .add('All Paths (lazy) - Medium Graph', () => {
//   let count = 0;
//   for (const _ of lazyAllPaths(mediumNodes[0], mediumNodes[999])) {
//     count++;
//   }
//   return count;
// });

// Test cached arrays performance (calling leaves() multiple times)
suite
  .add('leaves() - First call (10000 nodes)', () => {
    const g = largeGraph.graph;
    return g.leaves().length;
  })
  .add('leaves() - Cached call (10000 nodes)', () => {
    const g = largeGraph.graph;
    g.leaves(); // Prime cache
    return g.leaves().length;
  })
  .add('branches() - First call (10000 nodes)', () => {
    const g = largeGraph.graph;
    return g.branches().length;
  })
  .add('branches() - Cached call (10000 nodes)', () => {
    const g = largeGraph.graph;
    g.branches(); // Prime cache
    return g.branches().length;
  });

// Test early termination benefit of lazy evaluation
suite
  .add('BFS (eager) - Stop after 100 nodes', () => {
    const result = BFS(largeNodes[0]);
    return result.slice(0, 100).length;
  })
  .add('BFS (lazy) - Stop after 100 nodes', () => {
    let count = 0;
    for (const _ of lazyBFS(largeNodes[0])) {
      count++;
      if (count >= 100) break;
    }
    return count;
  });

// Run benchmarks
suite
  .on('cycle', (event: Benchmark.Event) => {
    console.log(String(event.target));
  })
  .on('complete', () => {
    console.log('\nFastest: ' + suite.filter('fastest').map('name'));
    console.log('Slowest: ' + suite.filter('slowest').map('name'));
    // Explicitly exit to prevent hanging
    process.exit(0);
  })
  .run({ async: false });

// Safety timeout: exit after 5 minutes if benchmarks don't complete
// This prevents infinite hanging on problematic benchmarks
setTimeout(
  () => {
    console.error('\nBenchmark timeout - forcing exit');
    process.exit(1);
  },
  5 * 60 * 1000
);
