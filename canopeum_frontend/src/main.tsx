import './i18n'

import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { Seeds, Species } from '@services/api.ts'

// TODO: Ask Nicolas if these were originally added manually to the api.ts file:
// https://github.com/BesLogic/releaf-canopeum/pull/141/files#r1690523940
/* Monkeypatching to work around multipart/form-data issue with NSwag:
 * https://github.com/RicoSuter/NSwag/issues/1078
 * https://github.com/RicoSuter/NSwag/issues/1840
 * https://github.com/RicoSuter/NSwag/issues/3163
 * https://github.com/RicoSuter/NSwag/issues/3387
 */
Seeds.prototype.toString = function() {
  return JSON.stringify(this.toJSON())
}
Species.prototype.toString = function() {
  return JSON.stringify(this.toJSON())
}

const root = document.getElementById('root')
if (root == null) {
  throw new Error('Could not find element #root to bootstrap React.')
} else {
  createRoot(root).render(
    <App />,
  )
}
