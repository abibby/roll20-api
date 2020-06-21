import { Monster, monsters } from './5etools'
import { newMonster } from './monster'
import "./roll20"
import { withIndex } from './util'

const isMocked = typeof log !== 'function'
if (isMocked) {
    //@ts-ignore
    require('mock20')
}

const filteredMonsters = monsters.slice(0, 2)
for (const [i, monster] of withIndex(filteredMonsters)) {
    log(`${monster.name} (${i + 1}/${filteredMonsters.length})`)
    newMonster(monster)
}

log('Done')

if (isMocked) {
    //@ts-ignore
    MOCK20endOfLastScript()
}
