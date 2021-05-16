import { OperatorFunction } from "rxjs/internal/types";
import { dematerialize, filter, pluck } from "rxjs/operators";

import { MapNotification } from "../map-notification";

export function dematerializeMap<O, I>(): OperatorFunction<MapNotification<O, I>, I> {
    return (src$) =>
        src$.pipe(
            filter((v) => v instanceof MapNotification && !v.isStart && v.inner.notification.kind !== "C"),
            pluck("inner", "notification"),
            dematerialize()
        );
}
