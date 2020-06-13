import { Monster, HP, MonsterSize } from './5etools'
import "./roll20"

function floor(num: number): number {
    return num - (num % 1)
}

function max(...nums: number[]): number {
    let largest = nums[0]
    for (const num of nums) {
        if (num > largest) {
            largest = num
        }
    }
    return largest
}

type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

function createAttr(
    characterId: string,
    name: string,
    current: string | number,
    max?: string | number
) {
    const maxObj: { max?: string } = {}
    if (max !== undefined) {
        maxObj.max = String(max)
    }
    createObj('attribute', {
        characterid: characterId,
        name: name,
        current: String(current),
        ...maxObj,
    })
}

function addAbilityScore(characterId: string, ability: Ability, value: number) {
    const attrMap = {
        str: "strength",
        dex: "dexterity",
        con: "constitution",
        int: "intelligence",
        wis: "wisdom",
        cha: "charisma",
    }
    createAttr(characterId, attrMap[ability], value)
    createAttr(characterId, attrMap[ability] + '_base', value)
    createAttr(characterId, attrMap[ability] + '_mod', floor((value - 10) / 2))
    createAttr(characterId, attrMap[ability] + '_flag', '0')
}

function addHP(characterId: string, hp: HP) {

    createAttr(characterId, 'hp', hp.average, hp.average)
    createAttr(characterId, 'npc_hpformula', hp.formula, hp.formula)
}

function speedStr(speed: { [type: string]: number | undefined }) {
    let strs = []
    for (const type in speed) {
        if (speed.hasOwnProperty(type)) {
            const ft = speed[type];
            if (type !== 'walk') {
                strs.push(`${type} ${ft}ft.`)
            } else {
                strs.push(`${ft} ft.`)
            }
        }
    }

    return strs.join(', ')
}

function addSkills(characterId: string, skills: { [skill: string]: string | undefined }) {
    for (var skill in skills) {
        var score = skills[skill];
        if (skills.hasOwnProperty(skill) && score !== undefined) {
            createAttr(characterId, "npc_" + skill, score);
            createAttr(characterId, "npc_" + skill + "_base", score);
        }
    }
}

function sizeStr(size: MonsterSize): string {
    switch (size) {
        case 'T': return 'Tiny'
        case 'S': return 'Small'
        case 'M': return 'Medium'
        case 'L': return 'Large'
        case 'H': return 'Huge'
        case 'G': return 'Gargantuan'
    }
}

export function newMonster(m: Monster) {
    const c = createObj('character', { name: m.name })

    for (const attr of ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const) {
        addAbilityScore(c.id, attr, m[attr])
    }
    addHP(c.id, m.hp)

    createAttr(c.id, 'mancer_cancel', 'on')
    createAttr(c.id, 'npc', 1)
    createAttr(c.id, 'npc_options-flag', 'on')

    createAttr(c.id, 'npc_name', m.name)
    createAttr(c.id, 'npc_type', `${sizeStr(m.size)} ${m.type.type}`)
    createAttr(c.id, 'npc_ac', max(...m.ac))
    createAttr(c.id, 'npc_speed', speedStr(m.speed))
    addSkills(c.id, m.skill)
}

