import { Arrays } from 'cafe-utility'
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'

async function getJson(url) {
    const response = await fetch(url)
    const json = await response.json()
    return json
}

function makeEndpoints(hash) {
    return Arrays.initialize(10, i => `https://gateway-proxy-bee-${i}-0.gateway.ethswarm.org/bzz/${hash}/`)
}

async function downloadFile(url, target, lockWrapper) {
    const response = await fetch(url)
    if (response.status !== 200) {
        throw Error('Bad Status')
    }
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if (lockWrapper.value) {
        throw Error('Already Downloaded')
    }
    lockWrapper.value = true
    await writeFile(target, buffer)
}

const latest = await getJson('https://api.github.com/repos/Cafe137/bee-desktop-static-maker/releases/latest')

const [_, swarmHash] = latest.name.split('-')
const locked = { value: false }
const before = Date.now()
await Promise.any(makeEndpoints(swarmHash).map(x => downloadFile(x, 'static.zip', locked)))
const delta = Date.now() - before
console.log('downloaded in', delta, 'ms')
