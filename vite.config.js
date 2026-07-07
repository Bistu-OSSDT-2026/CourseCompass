import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 加载 .env 文件中的环境变量
  const env = loadEnv(mode, process.cwd(), '')
  // 优先使用 .env 中的 BACKEND_URL，其次用系统环境变量，最后 fallback
  const backendUrl = env.BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000'

  console.log(`[Vite] 后端代理目标: ${backendUrl}`)

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,  // 允许局域网访问 (0.0.0.0)
      // 后端 API 代理配置
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        }
      }
    }
  }
})
