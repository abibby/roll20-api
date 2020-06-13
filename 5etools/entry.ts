
export type Entry =
    | string
    | {
        type: "entries",
        name: string,
        entries: Entry[]
    }
    | {
        type: "abilityDc"
        name: string
        attributes: string
    }
    | {
        type: "table"
        caption: string,
        colLabels: Entry[],
        colStyles: string[],
        rows: Entry[][]
    }
    | {
        type: "cell"
        roll: {
            exact: number
        } | {
            min: number
            max: number
            pad?: boolean
        }
    }
    | {
        type: "list"
        items: string[]
    }
    | {
        type: "quote"
        entries: Entry[]
        by: string
    }

export interface NamedEntries {
    name: string
    entries: Entry[]
}