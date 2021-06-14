import { dematerialize, filter, pluck } from "rxjs/operators";

import { getPart, SelectFunction } from "../../parts/part/select";
import { MapNotification } from "../map-notification";

export function dematerializeMap<O, I, A = never>(): SelectFunction<MapNotification<O, I>, A, I> {
    return (src$) =>
        src$.pipe(
            getPart<MapNotification<O, I>>(MapNotification as any),
            filter((v) => !v.isStart && v.inner.notification.kind !== "C"),
            pluck("inner", "notification"),
            dematerialize()
        );
}
