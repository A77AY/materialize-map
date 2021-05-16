import { from } from "rxjs";
import { concatMap } from "rxjs/operators";

import { createMaterializeMap, endMaterializeMap } from "../../materialize-map";
import { BasicMap } from "../types/basic-map";

export const matConcatMap = createMaterializeMap<BasicMap>((project) =>
    concatMap((mapNotification, index) =>
        from(project(mapNotification.outer.value, index)).pipe(endMaterializeMap(mapNotification))
    )
);
