import fetch from 'node-fetch'
import { promises as fs } from 'fs'
import { resolve } from 'path'

// const basePath = 'https://5e.tools/data/'
const gitHash = '9eba5e190966d745851fa3e1718867da9d82be31'
const basePath = `https://raw.githubusercontent.com/TheGiddyLimit/TheGiddyLimit.github.io/${gitHash}/data/`
async function downloadFolder(folder: string, outFile: string) {
    const index = await fetch(basePath + folder + '/index.json').then(r => r.json())
    const items = []
    for (const path of Object.values(index)) {
        const content = await fetch(basePath + folder + '/' + path).then(r => r.json())

        items.push(...content[Object.keys(content).filter(k => !k.startsWith('_'))[0]])
    }
    await fs.writeFile(outFile, JSON.stringify(items, undefined, '    '))
}
async function downloadFile(file: string, outFile: string) {
    const content = await fetch(basePath + '/' + file + '.json').then(r => r.json())
    await fs.writeFile(outFile, JSON.stringify(content[Object.keys(content)[0]], undefined, '    '))
}

(async () => {
    await downloadFolder('bestiary', resolve(__dirname, '../src/5etools/monster-data.json'))
})()