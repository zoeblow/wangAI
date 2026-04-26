#!/usr/bin/env node

const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')

const repoRoot = path.resolve(__dirname, '..')
const sourceMap = [
  { name: 'cli', from: path.join(repoRoot, 'packages', 'cli', 'docs') },
  { name: 'sync', from: path.join(repoRoot, 'packages', 'sync', 'docs') }
]
const docsRoot = path.join(repoRoot, 'docs')

async function copyDir(from, to) {
  if (!fs.existsSync(from)) {
    return
  }
  await fsp.rm(to, { recursive: true, force: true })
  await fsp.mkdir(to, { recursive: true })
  const entries = await fsp.readdir(from, { withFileTypes: true })
  for (const entry of entries) {
    const src = path.join(from, entry.name)
    const dst = path.join(to, entry.name)
    if (entry.isDirectory()) {
      await copyDir(src, dst)
    } else {
      await fsp.copyFile(src, dst)
    }
  }
}

async function main() {
  await fsp.mkdir(docsRoot, { recursive: true })
  for (const item of sourceMap) {
    const to = path.join(docsRoot, item.name)
    await copyDir(item.from, to)
    process.stdout.write(`[sync-docs] ${item.name}: ${item.from} -> ${to}\n`)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
