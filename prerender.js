// prerender.js - runs during vite build, no browser needed
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function prerender() {
  // Read the built index.html
  const template = fs.readFileSync(
    path.resolve(__dirname, 'dist/index.html'),
    'utf-8'
  )

  console.log('Pre-render: index.html found, size:', template.length)
  return template
}
