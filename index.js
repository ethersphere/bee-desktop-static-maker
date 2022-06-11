import { Files, Strings, System } from 'cafe-utility'
import { copy } from 'fs-extra'
import { mkdir, rm } from 'fs/promises'
import { join, resolve } from 'path'

const dirname = `temp-${Strings.randomAlphanumeric(8)}`

const beeDashboardDir = resolve(join(dirname, 'bee-dashboard'))
const installerDir = resolve(join(dirname, 'desktop-node-installer'))

async function cloneRepository(name, target) {
    await System.execAsync(
        `git clone https://Cafe137:${process.env.GIT_CLONE_TOKEN}@github.com/${name}.git --depth 1`,
        false,
        true,
        {
            cwd: resolve(target)
        }
    )
}

async function buildRepository(directory) {
    await System.execAsync('npm i && npm run build', false, true, {
        cwd: resolve(directory)
    })
}

try {
    await mkdir(dirname)
    await cloneRepository('ethersphere/bee-dashboard', dirname)
    await cloneRepository('ethersphere/desktop-node-installer', dirname)
    await buildRepository(beeDashboardDir)
    await buildRepository(installerDir)
    if (await Files.existsAsync('dist')) {
        await rm('dist', { recursive: true })
    }
    await mkdir('dist/static/installer', { recursive: true })
    await mkdir('dist/static/dashboard')
    await copy(join(beeDashboardDir, 'build'), 'dist/static/dashboard')
    await copy(join(installerDir, 'build'), 'dist/static/installer')
    await copy('assets', 'dist')
    await System.execAsync('zip -r static.zip dist/*')
} finally {
    await rm(dirname, { recursive: true })
}
