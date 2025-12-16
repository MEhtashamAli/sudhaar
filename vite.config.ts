import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // If we are building for production (GitHub), use '/sudhaar/'
  // If we are developing locally, use '/' (normal)
  base: mode === 'production' ? '/sudhaar/' : '/',
}))