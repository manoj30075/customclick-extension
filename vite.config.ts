import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.tsx'),
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'popup.html' || assetInfo.name === 'options.html') {
            return '[name].[ext]';
          }
          return '[name].[ext]';
        },
        // Ensure content script is self-contained
        manualChunks: (id) => {
          if (id.includes('src/content')) {
            return 'content';
          }
        },
      },
      // Make content script a separate bundle without external dependencies
      external: (id) => {
        // Don't externalize anything for content script
        return false;
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/assets': resolve(__dirname, 'src/assets'),
    },
  },
});