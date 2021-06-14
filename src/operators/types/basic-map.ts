import { ObservableInput, ObservedValueOf, OperatorFunction } from "rxjs/internal/types";

import { MapNotification } from "../../materialize-map";

export type BasicMap = <T, O extends ObservableInput<any>>(
    project: (value: T, index: number) => O
) => OperatorFunction<T, MapNotification<T, ObservedValueOf<O>>>;
