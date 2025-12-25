import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { codecovRollupPlugin } from '@codecov/rollup-plugin';

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.esm.json',
        declaration: true,
        declarationDir: './dist/esm',
        rootDir: './src',
      }),
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'treep-esm',
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    external: [], // Bundle everything for analysis
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.cjs.json',
        declaration: true,
        declarationDir: './dist/cjs',
        rootDir: './src',
        module: 'esnext', // Override for Rollup compatibility
      }),
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'treep-cjs',
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
    external: [], // Bundle everything for analysis
  },
];

