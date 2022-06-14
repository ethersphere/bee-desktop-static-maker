const date = new Date()
process.stdout.write(
    `::set-output name=prefix::${parseInt(
        `${String(date.getFullYear()).slice(2)}${String(date.getMonth()).padStart(2, '0')}${String(
            date.getDay()
        ).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}`,
        10
    ).toString('36')}\n`
)
