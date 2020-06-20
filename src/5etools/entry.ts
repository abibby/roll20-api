
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

function walkEntryText(entries: Entry[], cb: (text: string) => (boolean | void)): boolean {
    for (const entry of entries) {
        if (typeof entry === 'string') {
            const stop = cb(entry)
            if (stop) {
                return true
            }
        } else {
            switch (entry.type) {
                case 'entries':
                case 'quote':
                    const stop = walkEntryText(entry.entries, cb)
                    if (stop) {
                        return true
                    }
                    break
                case 'list':
                    for (const item of entry.items) {
                        const stop = cb(item)
                        if (stop) {
                            return true
                        }
                    }
                    break
            }
        }
    }
    return false
}

export function extractTag(entries: Entry[], tag: string): string | undefined {
    const tagRE = /{@([a-z]+) ([^}]+)}/g
    let t: string | undefined
    walkEntryText(entries, text => {
        let match: RegExpMatchArray | null
        while (match = tagRE.exec(text)) {
            if (match && match[1] === tag) {
                t = match[2]
                return true
            }
        }
    })
    return t
}

export function render(entries: Entry[]): string {
    let content = ''
    for (const entry of entries) {
        if (typeof entry === 'string') {
            return extractTemplates(entry)
        } else {
            switch (entry.type) {
                case "entries":
                case "quote":
                    content += render(entry.entries)
                    break
                case "list":
                    content += entry.items.map(item => '- ' + render([item])).join('\n')
                    break
                default:
                    throw new Error(`unsupported type ${entry.type}`)
            }
        }
    }
    return content
}

export const attackMap: { [key: string]: string | undefined } = {
    'mw': 'Melee',
    'mw,rw': 'Melee or Ranged',
}

const basic = (a: string) => a

const funcs: { [type: string]: (...args: string[]) => string } = {
    action: basic,
    atk: type => {
        const name = attackMap[type]
        if (name === undefined) {
            throw new Error(`No attack type ${type}`)
        }
        return name + ' Weapon Attack:'
    },
    chance: basic,
    condition: (a: string, b?: string, c?: string) => a,
    creature: (a: string, b?: string, c?: string) => c ?? a,
    damage: basic,
    dice: (a: string, b?: string) => b ?? a,
    filter: (a: string, b: string, c: string, d?: string, e?: string) => a,
    h: () => '',
    hit: basic,
    i: basic,
    item: (a: string, b: string, c?: string) => a,
    note: (a: string) => '',
    race: (a: string, b?: string, c?: string) => a,
    scaledamage: (newTotal: string, levelRange: string, diceAdded: string) => diceAdded,
    scaledice: (newTotal: string, levelRange: string, diceAdded: string) => diceAdded,
    sense: basic,
    skill: basic,
    spell: basic,
}

function extractTemplates(node: string): string {
    return splitByTags(node).map(c => {
        if (c[0] !== '@') {
            return c
        }
        const [, type, args] = c.match(/^@(\w+)(?: (.*))?$/) ?? ['', '', '']
        if (type in funcs) {
            return funcs[type](...(args ?? '').split('|'))
        }
        log(c)
        throw new Error(`no template ${type}`)
    }).join('')
}

const _splitByTagsBase = function (leadingCharacter: string, altLeadCharacter: string) {
    return function (string: string) {
        let tagDepth = 0;
        let char, char2;
        const out = [];
        let curStr = "";
        let isLastOpen = false;

        const len = string.length;
        for (let i = 0; i < len; ++i) {
            char = string[i];
            char2 = string[i + 1];

            switch (char) {
                case "{":
                    isLastOpen = true;
                    if (char2 === leadingCharacter) {
                        if (tagDepth++ > 0) {
                            curStr += "{";
                        } else {
                            out.push(curStr);
                            curStr = leadingCharacter;
                            ++i;
                        }
                    } else curStr += "{";
                    break;

                case "}":
                    isLastOpen = false;
                    if (tagDepth === 0) {
                        curStr += "}";
                    } else if (--tagDepth === 0) {
                        out.push(curStr);
                        curStr = "";
                    } else curStr += "}";
                    break;

                case leadingCharacter: {
                    if (altLeadCharacter && !isLastOpen) curStr += altLeadCharacter;
                    else curStr += leadingCharacter;
                    break;
                }

                default: isLastOpen = false; curStr += char; break;
            }
        }

        if (curStr) out.push(curStr);

        return out;
    }
}

const splitByTags = _splitByTagsBase("@", "&commat;")