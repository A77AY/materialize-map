import { EMPTY } from "rxjs";
import { pluck } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { getPart, SelectFunction } from "../part/select";

export class ValuePart<I> implements Part {
    constructor(public value?: I) {}

    create<O, I>(map: MapNotification<O, I>): ObservableOrValue<ValuePart<I>> {
        if (!map.isStart && map.inner.notification.kind === "N") return new ValuePart(map.inner.notification.value);
        return EMPTY;
    }

    static add<O, I>(): AddFunction<O, I, ValuePart<I>> {
        return (src$) => src$.pipe(createAdd(new ValuePart()));
    }

    static select<I, A = void>(): SelectFunction<ValuePart<I>, A, I> {
        return (src$) => src$.pipe(getPart(ValuePart), pluck("value"));
    }
}
