import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

const root = document.getElementById('root')
if (root == null) {
  throw new Error('Could not find element #root to bootstrap React.')
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
