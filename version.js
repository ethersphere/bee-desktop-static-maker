process.stdout.write(`\n::set-output name=version::1.0.0-${Math.floor(Date.now() / (4 * 60 * 1000) - 6895730)}\n`)
