import { Observable } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { distinctUntilChanged, filter, startWith, switchMap } from "rxjs/operators";

import { createObservable } from "../../utils/create-observable";
import { Part } from "./part";

export type SelectFunction<A, T> = OperatorFunction<A, T>;

export function createSelect<P extends { new (): Part<unknown, unknown, unknown> }, T>(
    klass: P,
    select: (value: InstanceType<P>) => T | Observable<T>,
    options: {
        compare?: (x: T, y: T) => boolean;
        startValue?: T;
    } = {}
): SelectFunction<InstanceType<P>, T> {
    let startValue = [] as any as [OperatorFunction<T, T>];
    if ("startValue" in options) startValue = [startWith<T, T>(options.startValue)];
    return (src$) =>
        src$.pipe(
            filter((input) => input instanceof klass),
            switchMap((v: InstanceType<P>) => createObservable(select(v))),
            ...startValue,
            distinctUntilChanged(options.compare)
        );
}
