import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// eslint-disable-next-line unicorn/no-anonymous-default-export -- Vite config standards
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        // KEEP IN SYNC WITH canopeum_frontend/.eslintrc.cjs AND canopeum_frontend/tsconfig.json
        '@assets': '/src/assets',
        '@components': '/src/components',
        '@config': '/src/config',
        '@constants': '/src/constants',
        '@hooks': '/src/hooks',
        '@models': '/src/models',
        '@pages': '/src/pages',
        '@services': '/src/services',
        '@store': '/src/store',
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
