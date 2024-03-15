import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    cleanup({ comments: 'none', extensions: ['.ts'] }),
    typescript(),
  ],
  context: 'this',
};
