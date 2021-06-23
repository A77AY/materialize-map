import { OperatorFunction } from "rxjs/internal/types";
import { scan } from "rxjs/operators";

import { InstanceSet, Klass } from "../../utils/instance-set";

/**
 * The combination is needed to store state
 * Also, each part can return several next and for their asynchronous work you need to combine them
 */
export function combineParts<T>(): OperatorFunction<T, InstanceSet<T>> {
    return (src$) =>
        src$.pipe(
            scan<T, InstanceSet<T>>((acc, value) => {
                const key = value?.constructor as Klass<any>;
                if (acc.has(key) && value !== acc.get(key)) acc = new InstanceSet(acc.map);
                acc.set(key, value);
                return acc;
            }, new InstanceSet())
            // `distinctUntilChanged()` is not suitable because the new value will be added only at the next event
        );
}
