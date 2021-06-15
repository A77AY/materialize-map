import { from, Notification, of } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { createMaterializeMap, endMaterializeMap, MapNotification, Outer } from "../../materialize-map";
import { BasicMap } from "../types/basic-map";

export const OUTER_A: Outer<string> = { value: "a" };
export const OUTER_B: Outer<string> = { value: "b" };

export const VALUES = {
    s: new MapNotification(OUTER_A),
    n: new MapNotification(OUTER_A, { notification: Notification.createNext(OUTER_A.value) }),
    c: new MapNotification(OUTER_A, { notification: Notification.createComplete() }),

    x: new MapNotification(OUTER_A, { notification: Notification.createNext("x") }),
    e: new MapNotification(OUTER_A, { notification: Notification.createError("e") }),

    S: new MapNotification(OUTER_B),
    N: new MapNotification(OUTER_B, { notification: Notification.createNext(OUTER_B.value) }),
    C: new MapNotification(OUTER_B, { notification: Notification.createComplete() }),
};

// TODO: move to createMaterializeMap test
export const testMatMap = createMaterializeMap<BasicMap>((project) =>
    mergeMap((mapNotification, index) =>
        from(project(mapNotification.outer.value, index)).pipe(endMaterializeMap(mapNotification))
    )
);

export const SIMPLE_MAT_MAP = testMatMap((v) => of(v));
