import { EMPTY } from "rxjs";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { createSelect, SelectFunction } from "../part/select";

const NO_ERROR = Symbol("No error");

export class ErrorPart<O, I, E> extends Part<O, I> {
    constructor(public error: E | symbol = NO_ERROR) {
        super();
    }

    create(map: MapNotification<O, I>): ObservableOrValue<ErrorPart<O, I, E>> {
        if (!map.isStart && map.inner.notification.kind === "E") return new ErrorPart(map.inner.notification.error);
        if (this.error === NO_ERROR) return EMPTY;
        return new ErrorPart();
    }

    static add<O, I, E, A = never>(): AddFunction<O, I, A, ErrorPart<O, I, E>> {
        return createAdd(new ErrorPart());
    }

    static select<O, I, E, A = never>(): SelectFunction<ErrorPart<O, I, E>, A, E> {
        return createSelect(ErrorPart, (v: ErrorPart<O, I, E>) => v.error, { filter: (v) => v !== NO_ERROR }) as any;
    }
}
