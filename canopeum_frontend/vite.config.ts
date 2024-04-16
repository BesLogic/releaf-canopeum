import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@assets': '/src/assets',
        '@components': '/src/components',
        '@constants': '/src/constants',
        '@services': '/src/services',
        '@utils': '/src/utils',
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
  })
}
