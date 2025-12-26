// Theme management
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
})();

// Version management
(function() {
  const versionSelect = document.getElementById('versionSelect');
  if (!versionSelect) return;

  // Get version from URL or default to latest
  const urlParams = new URLSearchParams(window.location.search);
  const versionFromUrl = urlParams.get('version') || 'latest';
  
  if (versionFromUrl !== 'latest') {
    versionSelect.value = versionFromUrl;
  }

  versionSelect.addEventListener('change', (e) => {
    const version = e.target.value;
    const currentUrl = new URL(window.location);
    
    if (version === 'latest') {
      currentUrl.searchParams.delete('version');
    } else {
      currentUrl.searchParams.set('version', version);
    }
    
    window.location.href = currentUrl.toString();
  });
})();

// Sidebar category toggling
(function() {
  const categoryToggles = document.querySelectorAll('.nav-category-toggle');
  
  // Expand all categories by default
  categoryToggles.forEach(toggle => {
    const category = toggle.getAttribute('data-category');
    const navItems = document.querySelector(`.nav-items[data-category="${category}"]`);
    if (navItems) {
      navItems.classList.add('expanded');
      toggle.classList.add('active');
    }
  });

  categoryToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const category = toggle.getAttribute('data-category');
      const navItems = document.querySelector(`.nav-items[data-category="${category}"]`);
      
      if (navItems) {
        const isExpanded = navItems.classList.contains('expanded');
        
        if (isExpanded) {
          navItems.classList.remove('expanded');
          toggle.classList.remove('active');
          toggle.classList.add('collapsed');
        } else {
          navItems.classList.add('expanded');
          toggle.classList.add('active');
          toggle.classList.remove('collapsed');
        }
      }
    });
  });
})();

// Sidebar search
(function() {
  const searchInput = document.getElementById('sidebarSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (query === '' || text.includes(query)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    // Expand categories with visible items
    const categories = document.querySelectorAll('.nav-category');
    categories.forEach(category => {
      const visibleItems = category.querySelectorAll('.nav-item:not(.hidden)');
      const toggle = category.querySelector('.nav-category-toggle');
      const navItems = category.querySelector('.nav-items');
      
      if (visibleItems.length > 0 && query !== '') {
        navItems.classList.add('expanded');
        toggle.classList.add('active');
      }
    });
  });
})();

// API content loading
(function() {
  const apiContent = document.getElementById('api-content');
  const navItems = document.querySelectorAll('.nav-item[data-api]');

  // Load API data (you can load from external file or use embedded data)
  function loadAPIData(apiName) {
    // For now, using a simplified approach
    // In production, you'd load from a JSON file or API
    return API_DATA[apiName] || null;
  }

  function renderAPIDoc(data) {
    if (!data) {
      return '<div class="welcome-section"><h1>API Not Found</h1><p>The requested API documentation could not be found.</p></div>';
    }

    let html = `<div class="api-doc">`;
    html += `<div class="api-doc-header">`;
    html += `<h1 class="api-doc-title">${data.name}</h1>`;
    html += `<div class="api-doc-meta">`;
    html += `<span class="api-type-badge">${data.type}</span>`;
    html += `<span class="api-since">Since: ${data.since}</span>`;
    html += `</div>`;
    html += `</div>`;

    html += `<div class="api-signature">${data.signature}</div>`;
    html += `<p class="api-description">${data.description}</p>`;

    if (data.arguments && data.arguments.length > 0) {
      html += `<div class="api-section">`;
      html += `<h2 class="api-section-title">Arguments</h2>`;
      data.arguments.forEach(arg => {
        html += `<div class="api-argument">`;
        html += `<div class="api-argument-name">${arg.name}${arg.optional ? ' <span class="api-optional">(optional)</span>' : ''}</div>`;
        html += `<div class="api-argument-type">${arg.type}</div>`;
        html += `<div class="api-argument-desc">${arg.description}</div>`;
        html += `</div>`;
      });
      html += `</div>`;
    }

    if (data.returns) {
      html += `<div class="api-section">`;
      html += `<h2 class="api-section-title">Returns</h2>`;
      html += `<div class="api-return">`;
      html += `<div class="api-return-type">${data.returns}</div>`;
      if (data.returnsDescription) {
        html += `<div class="api-argument-desc">${data.returnsDescription}</div>`;
      }
      html += `</div>`;
      html += `</div>`;
    }

    if (data.properties && data.properties.length > 0) {
      html += `<div class="api-section">`;
      html += `<h2 class="api-section-title">Properties</h2>`;
      data.properties.forEach(prop => {
        html += `<div class="api-argument">`;
        html += `<div class="api-argument-name">${prop.name}</div>`;
        html += `<div class="api-argument-type">${prop.type}</div>`;
        html += `<div class="api-argument-desc">${prop.description}</div>`;
        html += `</div>`;
      });
      html += `</div>`;
    }

    if (data.methods && data.methods.length > 0) {
      html += `<div class="api-section">`;
      html += `<h2 class="api-section-title">Methods</h2>`;
      data.methods.forEach(method => {
        html += `<div class="api-method-item">`;
        html += `<div class="api-argument-name">${method.name}</div>`;
        html += `<div class="api-argument-type">${method.signature}</div>`;
        html += `<div class="api-argument-desc">${method.description}</div>`;
        html += `</div>`;
      });
      html += `</div>`;
    }

    if (data.example) {
      html += `<div class="api-section">`;
      html += `<h2 class="api-section-title">Example</h2>`;
      html += `<div class="api-example">`;
      html += `<div class="code-block">`;
      html += `<div class="code-header">`;
      html += `<span>TypeScript</span>`;
      html += `<button class="copy-btn" data-copy="${escapeHtml(data.example)}">Copy</button>`;
      html += `</div>`;
      html += `<pre><code>${syntaxHighlight(data.example)}</code></pre>`;
      html += `</div>`;
      html += `</div>`;
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function syntaxHighlight(code) {
    // Escape HTML first to prevent XSS
    let highlighted = escapeHtml(code);
    
    // Simple, safe syntax highlighting
    // Process in specific order to avoid conflicts
    
    // 1. Comments first (entire line from // to end)
    highlighted = highlighted.replace(/(\/\/[^\n]*)/gm, '<span class="comment">$1</span>');
    
    // 2. Strings (quoted text) - be careful with escaped quotes
    highlighted = highlighted.replace(/(&quot;[^&]*?&quot;)/g, '<span class="string">$1</span>');
    highlighted = highlighted.replace(/(&#39;[^&]*?&#39;)/g, '<span class="string">$1</span>');
    
    // 3. Type annotations (already escaped as &lt; and &gt;)
    highlighted = highlighted.replace(/(&lt;[^&]*?&gt;)/g, '<span class="type">$1</span>');
    
    // 4. Keywords - match whole words, avoid matching inside existing spans
    const keywords = ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'new', 'return', 'from', 'if', 'else', 'for', 'of', 'in', 'typeof', 'instanceof'];
    keywords.forEach(keyword => {
      // Match keyword only if not inside a span tag
      const regex = new RegExp(`\\b${keyword}\\b(?![^<]*</span>)`, 'g');
      highlighted = highlighted.replace(regex, (match, offset, string) => {
        // Check if we're already inside a span
        const before = string.substring(0, offset);
        const openSpans = (before.match(/<span[^>]*>/g) || []).length;
        const closeSpans = (before.match(/<\/span>/g) || []).length;
        if (openSpans > closeSpans) {
          return match; // Already inside a span, don't highlight
        }
        return '<span class="keyword">' + match + '</span>';
      });
    });
    
    // 5. Numbers - simple match
    highlighted = highlighted.replace(/\b(\d+)\b(?![^<]*<\/span>)/g, '<span class="number">$1</span>');
    
    return highlighted;
  }

  function showSection(hash) {
    if (!apiContent) return;
    
    if (hash === '#getting-started') {
      apiContent.innerHTML = `
        <div class="api-doc">
          <div class="api-doc-header">
            <h1 class="api-doc-title">Getting Started</h1>
          </div>
          
          <div class="api-section">
            <h2 class="api-section-title">Installation</h2>
            <p class="api-description">Install Treep using npm or yarn:</p>
            <div class="code-block">
              <div class="code-header">
                <span>bash</span>
                <button class="copy-btn" data-copy="npm install treep">Copy</button>
              </div>
              <pre><code><span class="comment"># Using npm</span>
<span class="keyword">npm</span> <span class="function">install</span> treep

<span class="comment"># Using yarn</span>
<span class="keyword">yarn</span> <span class="function">add</span> treep

<span class="comment"># Using pnpm</span>
<span class="keyword">pnpm</span> <span class="function">add</span> treep</code></pre>
            </div>
          </div>

          <div class="api-section">
            <h2 class="api-section-title">Quick Start</h2>
            <p class="api-description">Create a graph, add leaves (nodes) and branches (edges), then traverse with powerful algorithms.</p>
            <div class="code-block">
              <div class="code-header">
                <span>TypeScript</span>
                <button class="copy-btn" data-copy='import { Graph, BFS, shortestPath } from "treep";

interface User {
  name: string;
  age: number;
}

// Create a graph
const graph = new Graph&lt;User&gt;();

// Add leaves (nodes)
const alice = graph.addLeaf({ name: "Alice", age: 30 }, "alice");
const bob = graph.addLeaf({ name: "Bob", age: 25 }, "bob");
const charlie = graph.addLeaf({ name: "Charlie", age: 35 }, "charlie");

// Add branches (edges)
graph.addBranch(alice, bob);
graph.addBranch(bob, charlie);

// BFS traversal
const visited = BFS(alice, (leaf) => {
  console.log(leaf.value.name);
});

// Shortest path
const path = shortestPath(alice, charlie);'>Copy</button>
              </div>
              <pre><code><span class="keyword">import</span> { Graph, BFS, shortestPath } <span class="keyword">from</span> <span class="string">"treep"</span>;

<span class="keyword">interface</span> <span class="type">User</span> {
  <span class="property">name</span>: <span class="type">string</span>;
  <span class="property">age</span>: <span class="type">number</span>;
}

<span class="comment">// Create a graph</span>
<span class="keyword">const</span> graph = <span class="keyword">new</span> <span class="class">Graph</span>&lt;<span class="type">User</span>&gt;();

<span class="comment">// Add leaves (nodes)</span>
<span class="keyword">const</span> alice = graph.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Alice"</span>, <span class="property">age</span>: <span class="number">30</span> }, <span class="string">"alice"</span>);
<span class="keyword">const</span> bob = graph.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Bob"</span>, <span class="property">age</span>: <span class="number">25</span> }, <span class="string">"bob"</span>);
<span class="keyword">const</span> charlie = graph.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Charlie"</span>, <span class="property">age</span>: <span class="number">35</span> }, <span class="string">"charlie"</span>);

<span class="comment">// Add branches (edges)</span>
graph.<span class="function">addBranch</span>(alice, bob);
graph.<span class="function">addBranch</span>(bob, charlie);

<span class="comment">// BFS traversal</span>
<span class="keyword">const</span> visited = <span class="function">BFS</span>(alice, (leaf) => {
  <span class="function">console</span>.<span class="function">log</span>(leaf.value.name);
});

<span class="comment">// Shortest path</span>
<span class="keyword">const</span> path = <span class="function">shortestPath</span>(alice, charlie);</code></pre>
            </div>
          </div>

          <div class="api-section">
            <h2 class="api-section-title">Core Concepts</h2>
            <div class="concept-card">
              <h3>🌳 Tree Metaphor</h3>
              <p>Treep uses an intuitive tree metaphor throughout the API:</p>
              <ul>
                <li><strong>Node</strong> → <strong>Leaf</strong>: A node in the graph</li>
                <li><strong>Edge</strong> → <strong>Branch</strong>: A connection between nodes</li>
                <li><strong>Graph</strong>: The container for all leaves and branches</li>
              </ul>
            </div>
          </div>

          <div class="api-section">
            <h2 class="api-section-title">Requirements</h2>
            <ul>
              <li><strong>Node.js</strong>: 20+ (LTS)</li>
              <li><strong>TypeScript</strong>: 5.0+ (optional but recommended)</li>
              <li><strong>Browsers</strong>: Modern browsers (Chrome, Edge, Firefox, Safari)</li>
            </ul>
          </div>
        </div>
      `;
    } else if (hash === '#examples') {
      apiContent.innerHTML = `
        <div class="api-doc">
          <div class="api-doc-header">
            <h1 class="api-doc-title">Examples</h1>
          </div>
          
          <div class="api-section">
            <h2 class="api-section-title">Social Network</h2>
            <p class="api-description">Model user connections and find relationships in a social network.</p>
            <div class="code-block">
              <div class="code-header">
                <span>TypeScript</span>
                <button class="copy-btn" data-copy='import { Graph, BFS, shortestPath } from "treep";

interface User {
  name: string;
  age: number;
  city: string;
}

// Create a social network graph
const socialNetwork = new Graph&lt;User&gt;();

// Add users (leaves)
const alice = socialNetwork.addLeaf({ name: "Alice", age: 30, city: "NYC" }, "alice");
const bob = socialNetwork.addLeaf({ name: "Bob", age: 25, city: "SF" }, "bob");
const charlie = socialNetwork.addLeaf({ name: "Charlie", age: 35, city: "NYC" }, "charlie");
const diana = socialNetwork.addLeaf({ name: "Diana", age: 28, city: "LA" }, "diana");

// Add connections (branches)
socialNetwork.addBranch(alice, bob);
socialNetwork.addBranch(bob, charlie);
socialNetwork.addBranch(alice, diana);
socialNetwork.addBranch(charlie, diana);

// BFS traversal to find all connections
BFS(alice, (leaf) => {
  console.log(\`  - \${leaf.value.name} (\${leaf.value.city})\`);
});

// Find shortest path between two users
const path = shortestPath(alice, charlie);
path.forEach((leaf, index) => {
  if (index > 0) process.stdout.write(" -> ");
  process.stdout.write(leaf.value.name);
});

// Display network statistics
console.log(\`Total users: \${socialNetwork.size()}\`);
console.log(\`Total connections: \${socialNetwork.branchCount()}\`);'>Copy</button>
              </div>
              <pre><code><span class="keyword">import</span> { Graph, BFS, shortestPath } <span class="keyword">from</span> <span class="string">"treep"</span>;

<span class="keyword">interface</span> <span class="type">User</span> {
  <span class="property">name</span>: <span class="type">string</span>;
  <span class="property">age</span>: <span class="type">number</span>;
  <span class="property">city</span>: <span class="type">string</span>;
}

<span class="comment">// Create a social network graph</span>
<span class="keyword">const</span> socialNetwork = <span class="keyword">new</span> <span class="class">Graph</span>&lt;<span class="type">User</span>&gt;();

<span class="comment">// Add users (leaves)</span>
<span class="keyword">const</span> alice = socialNetwork.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Alice"</span>, <span class="property">age</span>: <span class="number">30</span>, <span class="property">city</span>: <span class="string">"NYC"</span> }, <span class="string">"alice"</span>);
<span class="keyword">const</span> bob = socialNetwork.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Bob"</span>, <span class="property">age</span>: <span class="number">25</span>, <span class="property">city</span>: <span class="string">"SF"</span> }, <span class="string">"bob"</span>);
<span class="keyword">const</span> charlie = socialNetwork.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Charlie"</span>, <span class="property">age</span>: <span class="number">35</span>, <span class="property">city</span>: <span class="string">"NYC"</span> }, <span class="string">"charlie"</span>);
<span class="keyword">const</span> diana = socialNetwork.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Diana"</span>, <span class="property">age</span>: <span class="number">28</span>, <span class="property">city</span>: <span class="string">"LA"</span> }, <span class="string">"diana"</span>);

<span class="comment">// Add connections (branches)</span>
socialNetwork.<span class="function">addBranch</span>(alice, bob);
socialNetwork.<span class="function">addBranch</span>(bob, charlie);
socialNetwork.<span class="function">addBranch</span>(alice, diana);
socialNetwork.<span class="function">addBranch</span>(charlie, diana);

<span class="comment">// BFS traversal to find all connections</span>
<span class="function">BFS</span>(alice, (leaf) => {
  <span class="function">console</span>.<span class="function">log</span>(<span class="template">\`  - \${leaf.value.name} (\${leaf.value.city})\`</span>);
});

<span class="comment">// Find shortest path between two users</span>
<span class="keyword">const</span> path = <span class="function">shortestPath</span>(alice, charlie);
path.forEach((leaf, index) => {
  <span class="keyword">if</span> (index > <span class="number">0</span>) process.stdout.write(<span class="string">" -> "</span>);
  process.stdout.write(leaf.value.name);
});

<span class="comment">// Display network statistics</span>
<span class="function">console</span>.<span class="function">log</span>(<span class="template">\`Total users: \${socialNetwork.size()}\`</span>);
<span class="function">console</span>.<span class="function">log</span>(<span class="template">\`Total connections: \${socialNetwork.branchCount()}\`</span>);</code></pre>
            </div>
          </div>

          <div class="api-section">
            <h2 class="api-section-title">Supply Chain with Weights</h2>
            <p class="api-description">Model delivery routes with weighted branches (delivery times) and find optimal paths.</p>
            <div class="code-block">
              <div class="code-header">
                <span>TypeScript</span>
                <button class="copy-btn" data-copy='import { Graph, shortestPath, renderASCII } from "treep";

interface Location {
  name: string;
  type: "warehouse" | "factory" | "store";
}

// Create supply chain graph with weighted branches
const supplyChain = new Graph&lt;Location&gt;();

// Add locations (leaves)
const warehouse = supplyChain.addLeaf({ name: "Main Warehouse", type: "warehouse" }, "warehouse");
const factory1 = supplyChain.addLeaf({ name: "Factory A", type: "factory" }, "factory1");
const factory2 = supplyChain.addLeaf({ name: "Factory B", type: "factory" }, "factory2");
const store1 = supplyChain.addLeaf({ name: "Store Downtown", type: "store" }, "store1");
const store2 = supplyChain.addLeaf({ name: "Store Uptown", type: "store" }, "store2");

// Add delivery routes with weights (delivery time in hours)
supplyChain.addBranch(warehouse, factory1, 2);
supplyChain.addBranch(warehouse, factory2, 3);
supplyChain.addBranch(factory1, store1, 1);
supplyChain.addBranch(factory1, store2, 2);
supplyChain.addBranch(factory2, store1, 4);
supplyChain.addBranch(factory2, store2, 1);

// Find shortest delivery path (weighted)
const path = shortestPath(warehouse, store1, supplyChain.branches());

// Calculate total delivery time
const totalTime = path.reduce((sum, leaf, index) => {
  if (index < path.length - 1) {
    const branch = leaf.branches.find((b) => b.to === path[index + 1]);
    return sum + (branch?.weight ?? 0);
  }
  return sum;
}, 0);

console.log(\`Total delivery time: \${totalTime} hours\`);

// Visualize the supply chain
console.log(renderASCII(supplyChain, warehouse));'>Copy</button>
              </div>
              <pre><code><span class="keyword">import</span> { Graph, shortestPath, renderASCII } <span class="keyword">from</span> <span class="string">"treep"</span>;

<span class="keyword">interface</span> <span class="type">Location</span> {
  <span class="property">name</span>: <span class="type">string</span>;
  <span class="property">type</span>: <span class="string">"warehouse"</span> | <span class="string">"factory"</span> | <span class="string">"store"</span>;
}

<span class="comment">// Create supply chain graph with weighted branches</span>
<span class="keyword">const</span> supplyChain = <span class="keyword">new</span> <span class="class">Graph</span>&lt;<span class="type">Location</span>&gt;();

<span class="comment">// Add locations (leaves)</span>
<span class="keyword">const</span> warehouse = supplyChain.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Main Warehouse"</span>, <span class="property">type</span>: <span class="string">"warehouse"</span> }, <span class="string">"warehouse"</span>);
<span class="keyword">const</span> factory1 = supplyChain.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Factory A"</span>, <span class="property">type</span>: <span class="string">"factory"</span> }, <span class="string">"factory1"</span>);
<span class="keyword">const</span> factory2 = supplyChain.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Factory B"</span>, <span class="property">type</span>: <span class="string">"factory"</span> }, <span class="string">"factory2"</span>);
<span class="keyword">const</span> store1 = supplyChain.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Store Downtown"</span>, <span class="property">type</span>: <span class="string">"store"</span> }, <span class="string">"store1"</span>);
<span class="keyword">const</span> store2 = supplyChain.<span class="function">addLeaf</span>({ <span class="property">name</span>: <span class="string">"Store Uptown"</span>, <span class="property">type</span>: <span class="string">"store"</span> }, <span class="string">"store2"</span>);

<span class="comment">// Add delivery routes with weights (delivery time in hours)</span>
supplyChain.<span class="function">addBranch</span>(warehouse, factory1, <span class="number">2</span>);
supplyChain.<span class="function">addBranch</span>(warehouse, factory2, <span class="number">3</span>);
supplyChain.<span class="function">addBranch</span>(factory1, store1, <span class="number">1</span>);
supplyChain.<span class="function">addBranch</span>(factory1, store2, <span class="number">2</span>);
supplyChain.<span class="function">addBranch</span>(factory2, store1, <span class="number">4</span>);
supplyChain.<span class="function">addBranch</span>(factory2, store2, <span class="number">1</span>);

<span class="comment">// Find shortest delivery path (weighted)</span>
<span class="keyword">const</span> path = <span class="function">shortestPath</span>(warehouse, store1, supplyChain.branches());

<span class="comment">// Calculate total delivery time</span>
<span class="keyword">const</span> totalTime = path.reduce((sum, leaf, index) => {
  <span class="keyword">if</span> (index < path.length - <span class="number">1</span>) {
    <span class="keyword">const</span> branch = leaf.branches.find((b) => b.to === path[index + <span class="number">1</span>]);
    <span class="keyword">return</span> sum + (branch?.weight ?? <span class="number">0</span>);
  }
  <span class="keyword">return</span> sum;
}, <span class="number">0</span>);

<span class="function">console</span>.<span class="function">log</span>(<span class="template">\`Total delivery time: \${totalTime} hours\`</span>);

<span class="comment">// Visualize the supply chain</span>
<span class="function">console</span>.<span class="function">log</span>(<span class="function">renderASCII</span>(supplyChain, warehouse));</code></pre>
            </div>
          </div>
        </div>
      `;
    } else {
      // Default welcome
      apiContent.innerHTML = '<div class="welcome-section"><h1>Treep Documentation</h1><p class="intro-text">Welcome to the Treep documentation. Use the sidebar to browse the API reference.</p></div>';
    }
    
    attachCopyHandlers();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function loadAPI(apiName) {
    const data = loadAPIData(apiName);
    if (apiContent) {
      apiContent.innerHTML = renderAPIDoc(data);
      
      // Re-attach copy button handlers
      attachCopyHandlers();
    }

    // Update active nav item
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-api') === apiName) {
        item.classList.add('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle nav item clicks (including section links)
  const allNavItems = document.querySelectorAll('.nav-item');
  allNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const apiName = item.getAttribute('data-api');
      const hash = item.getAttribute('href');
      
      // Check if it's a section link (Getting Started, Examples)
      if (item.classList.contains('nav-section-link')) {
        window.history.pushState(null, '', hash);
        showSection(hash);
        
        // Update active state
        allNavItems.forEach(navItem => {
          navItem.classList.remove('active');
        });
        item.classList.add('active');
        return;
      }
      
      // Update URL hash for API items
      window.history.pushState(null, '', hash);
      
      if (apiName) {
        loadAPI(apiName);
      }
    });
  });

  // Handle logo click
  const logoLink = document.getElementById('logoLink');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.history.pushState(null, '', '#getting-started');
      showSection('#getting-started');
      
      // Update active state
      allNavItems.forEach(navItem => {
        navItem.classList.remove('active');
      });
      const gettingStartedLink = document.querySelector('a[href="#getting-started"]');
      if (gettingStartedLink) {
        gettingStartedLink.classList.add('active');
      }
    });
  }

  // Handle initial hash
  if (window.location.hash) {
    const hash = window.location.hash;
    if (hash === '#getting-started' || hash === '#examples') {
      showSection(hash);
      const link = document.querySelector('a[href="' + hash + '"]');
      if (link) link.classList.add('active');
    } else {
      const apiName = hash.substring(1);
      loadAPI(apiName);
    }
  } else {
    // Default to Getting Started
    window.history.replaceState(null, '', '#getting-started');
    showSection('#getting-started');
    const gettingStartedLink = document.querySelector('a[href="#getting-started"]');
    if (gettingStartedLink) {
      gettingStartedLink.classList.add('active');
    }
  }

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      const hash = window.location.hash;
      if (hash === '#getting-started' || hash === '#examples') {
        showSection(hash);
        allNavItems.forEach(navItem => {
          navItem.classList.remove('active');
          if (navItem.getAttribute('href') === hash) {
            navItem.classList.add('active');
          }
        });
      } else {
        const apiName = hash.substring(1);
        loadAPI(apiName);
      }
    } else {
      showSection('#getting-started');
    }
  });
})();

// Copy to clipboard
function attachCopyHandlers() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeToCopy = button.getAttribute('data-copy');
      if (!codeToCopy) return;

      try {
        await navigator.clipboard.writeText(codeToCopy);
        
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.background = 'var(--accent)';
        button.style.color = 'white';
        button.style.borderColor = 'var(--accent)';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '';
          button.style.color = '';
          button.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = '✗ Failed';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      }
    });
  });
}

// Initialize copy handlers on page load
document.addEventListener('DOMContentLoaded', () => {
  attachCopyHandlers();
});
