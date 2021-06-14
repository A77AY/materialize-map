import { EMPTY, Observable, of } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { concatMap, distinctUntilChanged, filter, startWith, switchMap } from "rxjs/operators";

import { createObservable } from "../../utils/create-observable";
import { ClassKeyMap, MapOrValue } from "./add";
import { Part } from "./part";

export type SelectFunction<T, A, R> = OperatorFunction<MapOrValue<T | A>, R>;

export function getPart<T>(PartClass: { new (): T }): OperatorFunction<MapOrValue<T>, T> {
    return (src$) =>
        src$.pipe(
            concatMap((value) => {
                if (value instanceof PartClass) {
                    if (value) return of(value);
                } else if ((value as ClassKeyMap<T>)?.has(PartClass)) {
                    return of((value as ClassKeyMap<T>).get(PartClass));
                }
                return EMPTY;
            })
        );
}

export function createSelect<P extends Part<unknown, unknown, unknown>, T, A = never>(
    PartClass: { new (): P },
    select: (value: P) => T | Observable<T>,
    options: {
        filter?: (v: T) => boolean;
        compare?: (x: T, y: T) => boolean;
        startValue?: T;
    } = {}
): SelectFunction<P, A, T> {
    let startValue = [] as any as [OperatorFunction<T, T>];
    let filterValue = [] as any as [OperatorFunction<T, T>];
    if ("startValue" in options) startValue = [startWith<T, T>(options.startValue)];
    if ("filter" in options) filterValue = [filter(options.filter)];
    return (src$) =>
        src$.pipe(
            getPart(PartClass),
            switchMap((v) => createObservable(select(v))),
            ...startValue,
            ...filterValue,
            distinctUntilChanged(options.compare)
        );
}
