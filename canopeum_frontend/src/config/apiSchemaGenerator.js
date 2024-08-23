import * as fs from 'fs'
import * as path from 'path'
var schemaUrl = 'http://127.0.0.1:8000/api/schema/'
var outputPath = path.join(process.cwd(), '/src/config/openapi.yaml')
console.log('Fetching schema from:', schemaUrl)
console.log('Saving to:', outputPath)
fetch(schemaUrl)
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Failed to fetch schema')
    }
    return response.text()
  })
  .then(function(response) {
    fs.writeFileSync(outputPath, response)
  })
  .catch(function(error) {
    console.error('Failed to fetch schema:', error)
  })
