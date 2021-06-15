import { Notification } from "rxjs";

export interface Outer<T> {
    value: T;
}

export interface Inner<T> {
    notification: Notification<T>;
}

export class MapNotification<O = unknown, I = unknown> {
    get isStart(): boolean {
        return this.inner === undefined;
    }

    constructor(
        public outer: Outer<O>,
        // Start value hasn't inner
        public inner?: Inner<I>
    ) {}
}
