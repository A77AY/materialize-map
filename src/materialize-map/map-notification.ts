import { Notification } from "rxjs";

export interface Outer<T> {
    index: number;
    value: T;
}

export interface Inner<T> {
    index: number;
    notification: Notification<T>;
}

export class MapNotification<O, I> {
    get isStart(): boolean {
        return !this.inner;
    }

    constructor(
        public outer: Outer<O>,
        // Start value hasn't inner
        public inner: Inner<I> | null = null
    ) {}
}
