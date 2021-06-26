import { EMPTY, of } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { concatMap, distinctUntilChanged } from "rxjs/operators";

import { InstanceSet, Klass } from "../../utils/instance-set";
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
            }),
            distinctUntilChanged()
        );
}
