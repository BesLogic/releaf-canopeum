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
        '@config': '/src/config',
        '@constants': '/src/constants',
        '@hooks': '/src/hooks',
        '@models': '/src/models',
        '@services': '/src/services',
        '@utils': '/src/utils',
      },
    },
    envDir: './env',
    server: {
      watch: {
        usePolling: true,
      },
    },
  })
}
