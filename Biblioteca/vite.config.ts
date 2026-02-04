import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api/hardcover": {
          target: "https://api.hardcover.app",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/hardcover/, "/v1/graphql"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              const token = env.VITE_HARDCOVER_API_BEARER
              if (token) {
                proxyReq.setHeader("Authorization", `Bearer ${token}`)
              }
              proxyReq.setHeader("Content-Type", "application/json")
            })
          },
        },
      },
    },
  }
})
