import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/image-locker/',
  server: {
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          '@chakra-react': ['@chakra-ui/react'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
});
