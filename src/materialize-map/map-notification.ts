import { Notification } from "rxjs";

export interface Outer<T> {
    value: T;
}

export interface Inner<T> {
    notification: Notification<T>;
}

/**
 * MapNotification
 * All maps/transforms must have an initial and final notification:
 * start with empty inner and end with "E" (error) or "C" (complete) notification
 */
export class MapNotification<O = unknown, I = unknown> {
    get isStart(): boolean {
        return this.inner === undefined;
    }

    get isSeed(): boolean {
        return this.outer === undefined;
    }

    constructor(
        // Seed has no outer, but has inner
        public outer?: Outer<O>,
        // Start has inner
        public inner?: Inner<I>
    ) {}
}
