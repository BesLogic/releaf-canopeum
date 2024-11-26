import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const schemaUrl = 'http://127.0.0.1:8000/api/schema/'
const outputPath = path.join(__dirname, 'openapi.yaml')
const nswagPath = path.join(__dirname, '..', 'docs', 'canopeum.nswag')

const response = await fetch(schemaUrl)
if (!response.ok) {
  throw new Error('Failed to fetch schema, make sure the backend server is running')
}
const text = await response.text()
fs.writeFileSync(outputPath, text)
spawnSync('nswag', ['run', nswagPath], { stdio: 'inherit', shell: true })
console.info('Removing schema')
fs.unlinkSync(outputPath)
console.info('Running dprint formatter')
spawnSync('dprint fmt', { stdio: 'inherit', shell: true })
