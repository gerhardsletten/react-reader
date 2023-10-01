import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    lib: {
      entry: 'src/lib/index.ts',
      name: 'react-reader',
      fileName: (format) => `react-reader.${format}.js`,
    },
    rollupOptions: {
      external: /^react|epubjs|react-swipeable/,
    },
  },
})
