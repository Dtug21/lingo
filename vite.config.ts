import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  // GitHub Pages sirve el sitio bajo /lingo/; en dev se mantiene la raíz
  base: mode === 'production' ? '/lingo/' : '/',
  server: {
    host: true, // accesible desde otros dispositivos de la red local
  },
}));
