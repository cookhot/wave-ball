import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    name: 'WBWaveBall',
    file: 'lib/index.js',
    format: 'umd',
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};