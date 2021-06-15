import { merge } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { distinctUntilChanged, filter, mergeScan, publish } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { createObservable } from "../../utils/create-observable";
import { Part } from "./part";

export type AddFunction<O, I, A, B> = OperatorFunction<MapNotification<O, I> | A, MapNotification<O, I> | A | B>;

export function createAdd<O, I, B extends Part<unknown, unknown, unknown>, A = never>(
    seed: B
): AddFunction<O, I, A, B> {
    return (src$) =>
        src$.pipe(
            publish((multicasted$) =>
                merge(
                    multicasted$,
                    multicasted$.pipe(
                        filter((input) => input instanceof MapNotification),
                        mergeScan<MapNotification<O, I>, B>(
                            (lastPart, input) => createObservable(lastPart.create(input)),
                            seed,
                            1
                        ),
                        distinctUntilChanged()
                    )
                )
            )
        );
}
