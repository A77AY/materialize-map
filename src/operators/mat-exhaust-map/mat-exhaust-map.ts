import { from } from "rxjs";
import { exhaustMap, startWith } from "rxjs/operators";

import { createMaterializeMap, endMaterializeMap } from "../../materialize-map";
import { BasicMap } from "../types/basic-map";

export const matExhaustMap = createMaterializeMap<BasicMap>(
    (project) =>
        exhaustMap((mapNotification, index) =>
            from(project(mapNotification.outer.value, index)).pipe(
                endMaterializeMap(mapNotification),
                startWith(mapNotification)
            )
        ),
    true
);
