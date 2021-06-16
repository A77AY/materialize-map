import { from, Notification, of } from "rxjs";
import { ObservableInput, OperatorFunction } from "rxjs/internal/types";
import { concatMap, mergeScan, scan } from "rxjs/operators";

import { createMaterializeMap, endMaterializeMap, MapNotification } from "../../materialize-map";

type MergeScan = <T, R>(
    accumulator: (acc: R, value: T, index: number) => ObservableInput<R>,
    seed: R,
    concurrent?: number
) => OperatorFunction<T, MapNotification<T, R>>;

interface MapNotificationAccumulator<O = unknown, I = unknown> {
    mapNotification?: MapNotification<O, I>;
    accumulator?: I;
}

export const matMergeScan = createMaterializeMap<MergeScan>((accumulator, seed, concurrent) => (src$) => {
    const mapNotificationAccumulator = { accumulator: seed };
    return src$.pipe(
        mergeScan<MapNotification, MapNotificationAccumulator>(
            (accMapNotification, mapNotification, index) =>
                from(accumulator(accMapNotification.accumulator, mapNotification.outer.value, index)).pipe(
                    endMaterializeMap(mapNotification),
                    scan<MapNotification, MapNotificationAccumulator>(
                        (acc, mapNotification) => ({
                            mapNotification,
                            accumulator:
                                !mapNotification.isStart && mapNotification.inner.notification.kind === "N"
                                    ? mapNotification.inner.notification.value
                                    : acc.accumulator,
                        }),
                        {}
                    )
                ),
            mapNotificationAccumulator,
            concurrent
        ),
        concatMap((acc) =>
            acc === mapNotificationAccumulator
                ? of(
                      new MapNotification(),
                      new MapNotification(undefined, { notification: Notification.createNext(seed) }),
                      new MapNotification(undefined, { notification: Notification.createComplete() })
                  )
                : of(acc.mapNotification)
        )
    );
});
