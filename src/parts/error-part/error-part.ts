import { EMPTY } from "rxjs";
import { filter, pluck } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { getPart, SelectFunction } from "../part/select";

const NO_ERROR = Symbol("No error");

export class ErrorPart<E = unknown> implements Part {
    constructor(public error: E | symbol = NO_ERROR) {}

    create(map: MapNotification): ObservableOrValue<ErrorPart<E>> {
        if (!map.isStart && map.inner.notification.kind === "E") return new ErrorPart(map.inner.notification.error);
        if (this.error === NO_ERROR) return EMPTY;
        return new ErrorPart();
    }

    static add<O, I, E>(): AddFunction<O, I, ErrorPart<E>> {
        return (src$) => src$.pipe(createAdd(new ErrorPart()));
    }

    static select<E, A = void>(): SelectFunction<ErrorPart<E>, A, E> {
        return (src$) =>
            src$.pipe(
                getPart(ErrorPart),
                filter((v) => v.error !== NO_ERROR),
                pluck("error")
            );
    }
}
