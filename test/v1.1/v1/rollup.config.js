import svelte from 'rollup-plugin-svelte';
import nodeGlobals from 'rollup-plugin-node-globals';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'svelte-components/CityInfo.svelte',
  output: {
    file: 'city-info.js',
    format: 'iife'
  },
  plugins: [
    nodeGlobals(),
    nodeResolve(),
    svelte({
      compilerOptions: {
        generate: 'dom', // or 'dom' if you're building for the browser
      },
      env: {
        performance: {
          now: () => Date.now(),
        },
      },
    }),
  ],
  onwarn: (warning, rollupWarn) => {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    rollupWarn(warning);
  },
};
