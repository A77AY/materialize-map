export type Klass<T> = { new (...args: any[]): T };

export class InstanceSet<T> {
    get map(): Map<Klass<T>, T> {
        return this.#map;
    }

    readonly #map: Map<Klass<T>, T>;

    constructor(entries?: Iterable<readonly [Klass<T>, T]>) {
        this.#map = new Map<Klass<T>, T>(entries);
    }

    has(klass: Klass<T>): boolean {
        return this.map.has(klass);
    }

    get(klass: Klass<T>): T {
        return this.map.get(klass);
    }

    set(klass: Klass<T>, value: T): this {
        this.map.set(klass, value);
        return this;
    }

    delete(klass: Klass<T>): boolean {
        return this.map.delete(klass);
    }
}
