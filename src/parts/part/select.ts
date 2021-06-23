import { EMPTY, Observable, of } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { concatMap, distinctUntilChanged, filter, startWith, switchMap } from "rxjs/operators";

import { createObservable } from "../../utils/create-observable";
import { InstanceSet, Klass } from "../../utils/instance-set";
import { Part } from "./part";
import { InstanceSetOrValue } from "./types/instance-set-or-value";

export type SelectFunction<T, A, R> = OperatorFunction<InstanceSetOrValue<T | A>, R>;

export function getPart<T>(PartClass: Klass<T>): OperatorFunction<InstanceSetOrValue<T>, T> {
    return (src$) =>
        src$.pipe(
            concatMap((value) => {
                if (value instanceof PartClass) {
                    if (value) return of(value);
                } else if (value instanceof InstanceSet && value.has(PartClass)) {
                    return of(value.get(PartClass));
                }
                return EMPTY;
            })
        );
}

export function createSelect<P extends Part, A, T>(
    PartClass: { new (): P },
    select: (value: P) => T | Observable<T>,
    options: {
        filter?: (v: T) => boolean;
        compare?: (x: T, y: T) => boolean;
        startValue?: T;
    } = {}
): SelectFunction<P, A, T> {
    let startValue: [OperatorFunction<T, T>] = [] as any;
    let filterValue: [OperatorFunction<T, T>] = [] as any;
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
