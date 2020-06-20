
declare namespace Roll20 {
    interface EventMap {
        'ready': void
        'add:character': Character
    }
}

declare function on<K extends keyof Roll20.EventMap>(event: K, callback: (event: Roll20.EventMap[K]) => void): void;
