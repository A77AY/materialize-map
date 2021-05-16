import { from, Notification, of } from "rxjs";
import { concatMap, mergeMap } from "rxjs/operators";

import { createMaterializeMap, endMaterializeMap, MapNotification, Outer } from "../../materialize-map";
import { BasicMap } from "../types/basic-map";

export const OUTER_0: Outer<string> = {
    index: 0,
    value: "a",
};

export const OUTER_1: Outer<string> = {
    index: 1,
    value: "b",
};

export const VALUES = {
    s: new MapNotification(OUTER_0),
    n: new MapNotification(OUTER_0, { index: 0, notification: Notification.createNext(OUTER_0.value) }),
    c: new MapNotification(OUTER_0, { index: 1, notification: Notification.createComplete() }),

    x: new MapNotification(OUTER_0, { index: 1, notification: Notification.createNext("x") }),
    e: new MapNotification(OUTER_0, { index: 0, notification: Notification.createError("e") }),

    S: new MapNotification(OUTER_1),
    N: new MapNotification(OUTER_1, { index: 0, notification: Notification.createNext(OUTER_1.value) }),
    C: new MapNotification(OUTER_1, { index: 1, notification: Notification.createComplete() }),
};

// TODO: move to createMaterializeMap test
export const testMatMap = createMaterializeMap<BasicMap>((project) =>
    mergeMap((mapNotification, index) =>
        from(project(mapNotification.outer.value, index)).pipe(endMaterializeMap(mapNotification))
    )
);

export const SIMPLE_MAT_MAP = testMatMap((v) => of(v));
