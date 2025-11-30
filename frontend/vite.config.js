import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /graphql to local backend in dev so the client can use '/graphql' as a relative path
// For production, the API endpoint is injected at build time via VITE_API_URL
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()]
  }
  if (command === 'serve') {
    config.server = {
      proxy: {
        '/graphql': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
  return config
})
