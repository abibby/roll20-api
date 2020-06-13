import { Monster, HP, MonsterSize } from './5etools'
import "./roll20"

const monsters: ReadonlyArray<Readonly<Monster>> = [
    {
        "name": "Aarakocra",
        "source": "MM",
        "page": 12,
        "otherSources": [
            {
                "source": "PotA"
            },
            {
                "source": "SKT"
            },
            {
                "source": "ToA"
            },
            {
                "source": "EGW"
            }
        ],
        "size": "M",
        "type": {
            "type": "humanoid",
            "tags": [
                "aarakocra"
            ]
        },
        "alignment": [
            "N",
            "G"
        ],
        "ac": [
            12
        ],
        "hp": {
            "average": 13,
            "formula": "3d8"
        },
        "speed": {
            "walk": 20,
            "fly": 50
        },
        "str": 10,
        "dex": 14,
        "con": 10,
        "int": 11,
        "wis": 12,
        "cha": 11,
        "skill": {
            "perception": "+5"
        },
        "passive": 15,
        "languages": [
            "Auran",
            "Aarakocra"
        ],
        "cr": "1/4",
        "trait": [
            {
                "name": "Dive Attack",
                "entries": [
                    "If the aarakocra is flying and dives at least 30 ft. straight toward a target and then hits it with a melee weapon attack, the attack deals an extra 3 ({@dice 1d6}) damage to the target."
                ]
            }
        ],
        "action": [
            {
                "name": "Talon",
                "entries": [
                    "{@atk mw} {@hit 4} to hit, reach 5 ft., one target. {@h}4 ({@damage 1d4 + 2}) slashing damage."
                ]
            },
            {
                "name": "Javelin",
                "entries": [
                    "{@atk mw,rw} {@hit 4} to hit, reach 5 ft. or range 30/120 ft., one target. {@h}5 ({@damage 1d6 + 2}) piercing damage."
                ]
            },
            {
                "name": "Summon Air Elemental",
                "entries": [
                    "Five aarakocra within 30 feet of each other can magically summon an {@creature air elemental}. Each of the five must use its action and movement on three consecutive turns to perform an aerial dance and must maintain concentration while doing so (as if concentrating on a spell). When all five have finished their third turn of the dance, the elemental appears in an unoccupied space within 60 feet of them. It is friendly toward them and obeys their spoken commands. It remains for 1 hour, until it or all its summoners die, or until any of its summoners dismisses it as a bonus action. A summoner can't perform the dance again until it finishes a short rest. When the elemental returns to the Elemental Plane of Air, any aarakocra within 5 feet of it can return with it."
                ]
            }
        ],
        "environment": [
            "mountain"
        ],
        "soundClip": "https://media-waterdeep.cursecdn.com/file-attachments/0/7/aarakocra.mp3",
        "languageTags": [
            "AU",
            "OTH"
        ],
        "damageTags": [
            "P",
            "S"
        ],
        "miscTags": [
            "MW",
            "RW",
            "THW"
        ]
    },
]

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

function newMonster(m: Monster) {
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

}

newMonster(monsters[0])

log('Done')