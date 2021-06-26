import { OperatorFunction } from "rxjs/internal/types";
import { mergeScan } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { createObservable } from "../../utils/create-observable";
import { Part } from "./part";

export type AddFunction<O, I, P> = OperatorFunction<MapNotification<O, I>, P>;

export function createAdd<O, I, P extends Part>(seed: P): AddFunction<O, I, P> {
    return (src$) => src$.pipe(mergeScan((lastPart, input) => createObservable(lastPart.create(input)), seed, 1));
}
