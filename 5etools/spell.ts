export interface Spell {
    name: string
    source: string
    page: number
    srd?: true
    level: number
    school: SpellSchool
    time: {
        number: number,
        unit: SpellTimeUnit
    }
    meta?: any
    range: SpellRange,
    components: SpellComponents
    duration: SpellDuration[]
    entries: SpellEntry[]
    entriesHigherLevel?: SpellEntry[]
    damageInflict?: DamageType[]
    savingThrow?: SavingThrow[]
    areaTags?: AreaTag[]
    classes: {
        fromClassList: PlayerClass[]
        fromSubclass: {
            class: PlayerClass[]
            subclass: PlayerClass[]
        }
    }
    races?: Race[]
    backgrounds?: Background[]
}


export type SpellEntry = string
    | { type: string, name: string, entries: string[] }
    | { type: "list", items: string[] }

export interface SpellRange {
    type: 'point' | 'radius' | 'sphere' | 'cone'
    distance: {
        type: string,
        amount: number
    }
}


export type SpellDuration = {
    type: 'timed',
    duration: Duration,
    concentration?: true
}
    | { type: "instant" }
    | {
        type: "permanent"
        ends: [
            "dispel"
        ]
    }

export type Duration = {
    type: 'round' | 'minute' | 'hour' | 'day',
    amount: number
} | { type: 'self' }

export interface SpellComponents {
    v?: true
    s?: true
    m?: string
}

export type SpellSchool = 'V' // Evocation
    | 'T' // Transmutation
    | 'C' // Conjuration
    | 'A' // Abjuration
    | 'N' // Necromancy
    | 'D' // Divination
    | 'I' // Illusion
    | 'E' // Enchantment

export type SpellTimeUnit = 'action' | 'bonus' | 'reaction'
export type DamageType = 'acid' | 'bludgeoning' | 'cold' | 'fire' | 'force' | 'lightning' | 'necrotic' | 'piercing' | 'poison' | 'psychic' | 'radiant' | 'thunder'
export type SavingThrow = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'
export type AreaTag = 'S' | 'ST'| 'Y' | 'MT' | 'L' | 'C' | 'W' | 'N' | 'Q'

export interface PlayerClass {
    name: string
    source: string
}

export interface Race    {
    name: string
    source: string
    baseName: string
    baseSource: string
}


// I think this only holds Guilds of Ravnica stuff
export interface Background {
    name: string
    source: string
}