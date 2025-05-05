import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

// Ensure external dependencies aren't included in the bundle
const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
];

export default [
  // UMD build (for direct browser usage via <script> tag)
  {
    input: 'src/index.ts',
    output: {
      name: 'WAO',
      file: 'dist/wao.min.js',
      format: 'umd',
      exports: 'named',
      sourcemap: true,
      globals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser()
    ],
    external: ['react', 'react-dom']
  },
  // CommonJS and ES module builds for core
  {
    input: 'src/index.ts',
    output: [
      { 
        file: pkg.main, 
        format: 'cjs',
        exports: 'named',
        sourcemap: true 
      },
      { 
        file: pkg.module, 
        format: 'es',
        exports: 'named',
        sourcemap: true 
      }
    ],
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.json' })
    ],
    external
  },
  // CommonJS and ES module builds for React integration
  {
    input: 'src/react.js',
    output: [
      { 
        file: 'dist/react.js', 
        format: 'cjs',
        exports: 'named',
        sourcemap: true 
      },
      { 
        file: 'dist/react.esm.js', 
        format: 'es',
        exports: 'named',
        sourcemap: true 
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        allowJs: true,
        // Prevent TypeScript from processing JSX
        jsx: 'preserve',
        noImplicitAny: false,
        declaration: true
      })
    ],
    external: ['react', 'react-dom', './core']
  }
]; 
