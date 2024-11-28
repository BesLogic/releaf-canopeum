import { spawnSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const schemaUrl = 'http://127.0.0.1:8000/api/schema/'
const nswagPath = path.join(__dirname, '..', 'docs', 'canopeum.nswag')

// eslint-disable-next-line unicorn/prefer-json-parse-buffer -- typescript disagrees
const nswagConfigJSON = JSON.parse(fs.readFileSync(nswagPath, 'utf8'))
const openAPIPath = path.join(
  nswagPath,
  '..',
  nswagConfigJSON.documentGenerator.fromDocument.url,
)
const generatedAPIPath = path.join(
  nswagPath,
  '..',
  nswagConfigJSON.codeGenerators.openApiToTypeScriptClient.output,
)

const response = await fetch(schemaUrl)
if (!response.ok) {
  throw new Error('Failed to fetch schema, make sure the backend server is running')
}
fs.writeFileSync(openAPIPath, await response.text())
spawnSync('nswag', ['run', nswagPath], { stdio: 'inherit', shell: true })
console.info('Removing schema')
fs.unlinkSync(openAPIPath)

console.info('Fixing unsafe type')
fs.writeFileSync(
  generatedAPIPath,
  fs.readFileSync(generatedAPIPath, 'utf8')
    .replaceAll('[key: string]: any', '[key: string]: unknown'),
)

console.info('Running dprint formatter')
spawnSync('dprint fmt', { stdio: 'inherit', shell: true })
