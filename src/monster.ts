import { Monster, HP, MonsterSize, extractTag, render, attackMap } from './5etools'
import { generateID, withIndex } from './util'
import "./roll20"

interface Attack {
    name: string
    type: string
    range: string
    toHit: number
    damage: string
    description: string
}

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
    max: string | number = ''
) {
    createObj('attribute', {
        characterid: characterId,
        name: name,
        current: String(current),
        max: String(max),
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

function createAttack(characterId: string, index: number, attack: Attack) {
    const attackID = generateID()
    createObj('ability', {
        characterid: characterId,
        name: `Attack: ${attack.name}`,
        action: `%{selected|repeating_npcaction_${attackID}_npc_action}`,
        istokenaction: true,
    })
    function createAttackAttr(prop: string, value: string | number | undefined) {
        if (value === undefined) {
            return
        }
        createAttr(characterId, `repeating_npcaction_$${index}_${prop}`, value)
    }

    createAttackAttr('name', attack.name)
    createAttackAttr('description', attack.description)
    createAttackAttr('attack_flag', 'on')
    createAttackAttr('attack_type', attackMap[attack.type])
    createAttackAttr('attack_range', attack.range)
    createAttackAttr('attack_tohit', attack.toHit)
    createAttackAttr('attack_damage', attack.damage)
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
    createAttr(c.id, 'dtype', 'full')
    createAttr(c.id, 'wtype', '/w gm')

    createAttr(c.id, 'npc_name', m.name)
    createAttr(c.id, 'npc_type', `${sizeStr(m.size)} ${m.type.type}`)
    createAttr(c.id, 'npc_ac', max(...m.ac))
    createAttr(c.id, 'npc_speed', speedStr(m.speed))
    addSkills(c.id, m.skill)

    for (const [i, action] of withIndex(m.action)) {
        const type = extractTag(action.entries, 'atk')
        if (type === undefined) {
            continue
        }
        createAttack(c.id, i, {
            name: action.name,
            type: type,
            range: '',
            toHit: Number(extractTag(action.entries, 'hit')),
            damage: extractTag(action.entries, 'damage') ?? '',
            description: render(action.entries)
        })
    }

}