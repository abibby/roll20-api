export function generateID(): string {
    // -[a-zA-Z0-9]{19}
    let id = '-'
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < 19; i++) {
        id += chars[randomInteger(chars.length) - 1]
    }
    return id
}

export function withIndex<T>(arr: T[]): [number, T][] {
    return arr.map((v, i) => [i, v])
}