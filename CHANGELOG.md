# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-25

### Added

- Core classes: `Node` (Leaf), `Branch` (Edge), `Graph`
- Traversal algorithms: `BFS`, `DFS`, `shortestPath`, `detectCycles`, `allPaths`
- Schema validation: `validate`, `validateLeaf`, `validateBranch`, `validateGraph`, `validateTree`
- Utility functions: `normalize`, `fromJSON`, `mergeGraph`, `renderASCII`
- Error classes: `TreepError`, `GraphError`, `TreeError`, `ValidationError`, `TypeError`
- Full TypeScript support with type inference
- Comprehensive test suite (120 tests, 92.75% coverage)
- Example files: social network, supply chain, nested JSON
- GitHub Actions workflows: CI, test coverage, release, bundle size
- Dependabot configuration
- Documentation: README, CONTRIBUTING, LICENSE

### Features

- Tree metaphor throughout (Node → Leaf, Edge → Branch)
- Ultra-fast performance optimized for large datasets
- Zero runtime dependencies
- Framework-agnostic (Node.js, browser, React, Vue, Angular, React Native)
- Dual package support (ESM + CommonJS)
- Bundle size < 10KB target

[Unreleased]: https://github.com/rutvij26/treep/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/rutvij26/treep/releases/tag/v1.0.0

