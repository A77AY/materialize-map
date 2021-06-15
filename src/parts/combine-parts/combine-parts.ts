import { OperatorFunction } from "rxjs/internal/types";
import { scan } from "rxjs/operators";

import { ClassKeyMap } from "../part/types/class-key-map";

export function combineParts<T>(): OperatorFunction<T, ClassKeyMap<T>> {
    return (src$) =>
        src$.pipe(
            scan<T, ClassKeyMap<T>>((acc, value) => {
                const key = value.constructor as { new (): T };
                if (!(acc.has(key) && value !== acc.get(key))) acc = new Map(acc);
                acc.set(key, value);
                return acc;
            }, new Map())
        );
}
