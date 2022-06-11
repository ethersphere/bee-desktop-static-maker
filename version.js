process.stdout.write(`echo "::set-output name=version::1.0.0-${Math.floor(Date.now() / (4 * 60 * 1000) - 6895730)}"`)
