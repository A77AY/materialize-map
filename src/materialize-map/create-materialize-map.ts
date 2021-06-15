import { merge } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { materialize, publish, scan } from "rxjs/operators";

import { MapNotification } from "./map-notification";

export function createMaterializeMap<F extends (...args: any[]) => OperatorFunction<any, MapNotification<any, any>>>(
    operatorFn: (...args: Parameters<F>) => OperatorFunction<MapNotification<any, any>, MapNotification<any, any>>,
    withoutStartMapNotifications = false
): F {
    return ((...args: Parameters<F>) => {
        const operator = operatorFn(...args);
        return (src$) =>
            src$.pipe(
                scan(
                    (mapNotification, value) => new MapNotification({ value }),
                    new MapNotification({ value: undefined })
                ),
                withoutStartMapNotifications
                    ? operator
                    : publish((multicasted$) => merge(multicasted$, multicasted$.pipe(operator)))
            );
    }) as F;
}

export function endMaterializeMap<O, I>(
    startMapNotification: MapNotification<O, I>
): OperatorFunction<I, MapNotification<O, I>> {
    return (src$) =>
        src$.pipe(
            materialize(),
            scan(
                (mapNotification, notification) => new MapNotification(startMapNotification.outer, { notification }),
                new MapNotification(startMapNotification.outer)
            )
        );
}
