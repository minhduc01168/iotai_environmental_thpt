import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Cấu hình Proxy để chuyển hướng các gọi API về backend Flask
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Địa chỉ Backend Flask
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
