import { NamedEntries } from "./5etools";

interface Monster {
    name: string
    source: string
    page: number
    otherSources: { source: string }[]
    size: string
    type: {}
    alignment: [
        'L' | 'N' | 'C',
        'E' | 'N' | 'G'
    ]
    ac: number[]
    hp: {
        average: number
        formula: string
    }
    speed: { [type: string]: number | undefined }

    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
    skill: { [type: string]: string | undefined }
    passive: number

    languages: string[]
    cr: string
    trait: NamedEntries[]
    action: NamedEntries[]
    environment: string[]
    soundClip: string
    languageTags: string[]
    damageTags: string[]
    miscTags: string[]
}
export const monsters: Monster[] = [
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