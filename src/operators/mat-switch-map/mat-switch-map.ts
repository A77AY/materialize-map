import { from, of, Notification } from "rxjs";
import { concatMap, pairwise, startWith, switchMap } from "rxjs/operators";

import { createMaterializeMap, endMaterializeMap, MapNotification } from "../../materialize-map";
import { BasicMap } from "../types/basic-map";

export const matSwitchMap = createMaterializeMap<BasicMap>(
    (project) => (src$) =>
        src$.pipe(
            switchMap((mapNotification, index) =>
                from(project(mapNotification.outer.value, index)).pipe(
                    endMaterializeMap(mapNotification),
                    startWith(mapNotification)
                )
            ),
            startWith(null),
            pairwise(),
            concatMap(([oldValue, currentValue]) => {
                if (
                    currentValue.isStart &&
                    oldValue !== null &&
                    (oldValue.isStart || oldValue.inner.notification.kind === "N")
                ) {
                    return of(
                        new MapNotification(oldValue.outer, {
                            index: oldValue.isStart ? 0 : oldValue.inner.index + 1,
                            notification: Notification.createComplete(),
                        }),
                        currentValue
                    );
                }
                return of(currentValue);
            })
        ),
    true
);
