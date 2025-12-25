# Contributing to Treep

Thank you for your interest in contributing to Treep! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/treep.git`
3. Install dependencies: `npm install --legacy-peer-deps`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 20+ (LTS)
- npm or yarn
- TypeScript 5.0+

### Installation

```bash
npm install --legacy-peer-deps
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### Building

```bash
npm run build         # Build both ESM and CJS
```

### Code Quality

```bash
npm run lint          # Check linting
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code
npm run format:check  # Check formatting
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide type annotations for public APIs
- Use generic types where appropriate
- Follow the tree metaphor (Leaf/Branch terminology)

### Code Style

- Follow Prettier formatting (automatically applied)
- Use ESLint rules (configured in `.eslintrc.js`)
- Write self-documenting code with clear variable names
- Add JSDoc comments for public APIs

### Testing

- Write tests for all new features
- Maintain 80%+ test coverage
- Test edge cases and error conditions
- Use descriptive test names

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `chore:` Maintenance tasks

Example: `feat: add tree traversal methods`

## Pull Request Process

1. Update tests and documentation as needed
2. Ensure all tests pass: `npm test`
3. Ensure code is formatted: `npm run format`
4. Ensure linting passes: `npm run lint`
5. Update CHANGELOG.md with your changes
6. Create a pull request with a clear description

## Project Structure

- `src/` - Source code
  - `core/` - Core classes (Node, Branch, Graph)
  - `algorithms/` - Traversal algorithms
  - `utils/` - Utility functions
  - `errors/` - Error classes
- `tests/` - Test files
- `examples/` - Example usage files

## Questions?

Feel free to open an issue for questions or discussions.

## Author

**Rutvij Sathe**
- Website: https://rutvijsathe.dev
- GitHub: https://github.com/rutvij26

