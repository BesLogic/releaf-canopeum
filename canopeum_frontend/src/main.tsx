import './i18n'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
// import { setApiSetting } from './services/apiSettings.ts'

const root = document.getElementById('root')
if (root == null) {
  throw new Error('Could not find element #root to bootstrap React.')
} else {
  // setApiSetting({ apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL) })
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
