
declare namespace Roll20 {
    interface EventMap {
        'add:character': Character
    }
}

declare function on<K extends keyof Roll20.EventMap>(event: K, callback: (event: Roll20.EventMap[K]) => void): void;
