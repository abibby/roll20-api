import { NamedEntries } from "./entry";
import rawMonsters from './monster-data.json'

export interface MonsterHP {
    average: number
    formula: string
}
export type MonsterAC = Array<
    | { special: string }
    | {
        ac: number,
        from: string[],
        condition: string,
        braces: boolean,
    }
    | number
>


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
    type?: MonsterType
    alignment: [
        'L' | 'N' | 'C',
        'E' | 'N' | 'G'
    ]
    ac?: MonsterAC
    hp?: MonsterHP
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
    action?: NamedEntries[]
    environment: string[]
    soundClip: string
    languageTags: string[]
    damageTags: string[]
    miscTags: string[]
}

export const monsters = rawMonsters as Monster[]
