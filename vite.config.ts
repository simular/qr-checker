import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    plugins: [vue()],
    base: env.VITE_BASE_URL,
  };
});
