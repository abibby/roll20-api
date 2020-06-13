import { NamedEntries } from "./entry";

export interface HP {
    average: number
    formula: string
}

export interface MonsterType {
    type: string
    tags: string[]
}

export type MonsterSize = 'T' | 'S' | 'M' | 'L' | 'H' | 'G'

export interface Monster {
    name: string
    source: string
    page: number
    otherSources: { source: string }[]
    size: MonsterSize
    type: MonsterType
    alignment: [
        'L' | 'N' | 'C',
        'E' | 'N' | 'G'
    ]
    ac: number[]
    hp: HP
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