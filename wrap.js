import { copyFile, mkdir } from 'fs/promises'

await mkdir('static')
await copyFile('static.zip', 'static/static.zip')
