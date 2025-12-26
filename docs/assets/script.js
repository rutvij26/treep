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
  const navItems = document.querySelectorAll('.nav-item');

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

  // Handle nav item clicks
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const apiName = item.getAttribute('data-api');
      const hash = item.getAttribute('href');
      
      // Update URL hash
      window.history.pushState(null, '', hash);
      
      loadAPI(apiName);
    });
  });

  // Handle initial hash
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    loadAPI(hash);
  }

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      loadAPI(hash);
    } else {
      apiContent.innerHTML = '<div class="welcome-section"><h1>Treep Documentation</h1><p class="intro-text">Welcome to the Treep documentation. Use the sidebar to browse the API reference.</p></div>';
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
