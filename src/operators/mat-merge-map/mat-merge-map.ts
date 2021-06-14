import { from } from "rxjs";
import { ObservableInput, OperatorFunction, ObservedValueOf } from "rxjs/internal/types";
import { mergeMap } from "rxjs/operators";

import { createMaterializeMap, endMaterializeMap, MapNotification } from "../../materialize-map";

type MergeMap = <T, O extends ObservableInput<any>>(
    project: (value: T, index: number) => O,
    concurrent?: number
) => OperatorFunction<T, MapNotification<T, ObservedValueOf<O>>>;

export const matMergeMap = createMaterializeMap<MergeMap>((project, concurrent) =>
    mergeMap(
        (mapNotification, index) =>
            from(project(mapNotification.outer.value, index)).pipe(endMaterializeMap(mapNotification)),
        concurrent
    )
);
