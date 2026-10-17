import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.BASE_URL || '/RAIS-AGENCIES/',
  plugins: [react()],
  server: {
    port: 3001,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'lucide-react']
        }
      }
    }
  }
});
