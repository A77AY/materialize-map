import { EMPTY } from "rxjs";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { createSelect, SelectFunction } from "../part/select";

export class ProgressPart<O, I> extends Part<O, I> {
    constructor(public count = 0) {
        super();
    }

    create(map: MapNotification<O, I>): ObservableOrValue<ProgressPart<O, I>> {
        if (map.isStart) return new ProgressPart(this.count + 1);
        else if (map.inner && map.inner.notification.kind !== "N") return new ProgressPart(this.count - 1);
        return EMPTY;
    }

    static add<O, I, A = never>(): AddFunction<O, I, A, ProgressPart<O, I>> {
        return createAdd(new ProgressPart());
    }

    static select<O, I, A = never>(): SelectFunction<ProgressPart<O, I>, A, number> {
        return createSelect(ProgressPart, (v) => v.count, { startValue: 0 });
    }
}
