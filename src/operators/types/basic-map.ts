import { ObservableInput, OperatorFunction } from "rxjs/internal/types";
import { ObservedValueOf } from "rxjs/src/internal/types";

import { MapNotification } from "../../materialize-map/map-notification";

export type BasicMap = <T, O extends ObservableInput<any>>(
    project: (value: T, index: number) => O
) => OperatorFunction<T, MapNotification<T, ObservedValueOf<O>>>;
