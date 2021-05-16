import { isObservable, Observable, of } from "rxjs";

export type ObservableOrValue<T> = Observable<T> | T;

export function createObservable<T>(v: ObservableOrValue<T>): Observable<T> {
    return isObservable(v) ? v : of(v);
}
