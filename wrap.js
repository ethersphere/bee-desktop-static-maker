import { copyFile, mkdir } from 'fs/promises'

await mkdir('out')
await copyFile('static.zip', 'out/static.zip')
