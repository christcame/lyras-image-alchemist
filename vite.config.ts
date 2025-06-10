import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'work-1-ntqvttulpxpkynng.prod-runtime.all-hands.dev',
      'work-2-ntqvttulpxpkynng.prod-runtime.all-hands.dev',
      'localhost',
      '127.0.0.1'
    ],
    cors: true,
  },
});
