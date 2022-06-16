import { Strings, System } from 'cafe-utility'
import { copy } from 'fs-extra'
import { mkdir } from 'fs/promises'
import { join, resolve } from 'path'

const dirname = `temp-${Strings.randomAlphanumeric(8)}`

const beeDashboardDir = resolve(join(dirname, 'bee-dashboard'))
const installerDir = resolve(join(dirname, 'desktop-node-installer'))

async function cloneRepository(name, target, branch = 'master') {
    await System.execAsync(`git clone https://github.com/${name}.git --depth 1 --branch ${branch}`, false, true, {
        cwd: resolve(target)
    })
}

async function buildRepository(directory, sentryKey) {
    await System.execAsync('npm ci && npm run build', false, true, {
        cwd: resolve(directory),
        env: {
            'REACT_APP_SENTRY_KEY': sentryKey
        }
    })
}

await mkdir(dirname)
await cloneRepository('ethersphere/bee-dashboard', dirname, 'feat/account-tabs')
await cloneRepository('ethersphere/desktop-node-installer', dirname)
await buildRepository(beeDashboardDir, process.env.BEE_DASHBOARD_SENTRY_KEY)
await buildRepository(installerDir, process.env.BEE_DESKTOP_INSTALLER_SENTRY_KEY)
await mkdir('static/static/installer', { recursive: true })
await mkdir('static/static/dashboard')
await copy(join(beeDashboardDir, 'build'), 'static/static/dashboard')
await copy(join(installerDir, 'build'), 'static/static/installer')
await copy('assets', 'static')
await System.execAsync('(cd static && zip -r - .) >static.zip', false, true)
