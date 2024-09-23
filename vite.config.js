import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
<<<<<<< HEAD
=======
  server: {
    port: 5173,
    proxy: {
      '^/api': {
        // replace with your target
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/oauth2.0': {
        target: 'https://nid.naver.com',
        changeOrigin: true,
      },
    },
  },
>>>>>>> f2017514c33cb3c0b542a760271038312000df65
});
