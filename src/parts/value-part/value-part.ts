import { EMPTY } from "rxjs";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { createSelect, SelectFunction } from "../part/select";

export class ValuePart<O, I> extends Part<O, I> {
    constructor(public value?: I) {
        super();
    }

    create(map: MapNotification<O, I>): ObservableOrValue<ValuePart<O, I>> {
        if (!map.isStart && map.inner.notification.kind === "N") return new ValuePart(map.inner.notification.value);
        return EMPTY;
    }

    static add<O, I, A = never>(): AddFunction<O, I, A, ValuePart<O, I>> {
        return createAdd(new ValuePart());
    }

    static select<O, I, A = never>(): SelectFunction<ValuePart<O, I>, A, I> {
        return createSelect(ValuePart, (v: ValuePart<O, I>) => v.value);
    }
}
