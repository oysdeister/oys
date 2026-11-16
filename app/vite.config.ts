import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' para que dist funcione en cualquier ruta (Netlify, Vercel, GitHub Pages o carpeta de un servidor)
export default defineConfig({
  base: './',
  plugins: [react()],
})
