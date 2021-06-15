import { EMPTY } from "rxjs";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { createSelect, SelectFunction } from "../part/select";

export class ProgressCountPart<O, I> extends Part<O, I> {
    constructor(public count = 0) {
        super();
    }

    create(map: MapNotification<O, I>): ObservableOrValue<ProgressCountPart<O, I>> {
        if (map.isStart) return new ProgressCountPart(this.count + 1);
        else if (map.inner && map.inner.notification.kind !== "N") return new ProgressCountPart(this.count - 1);
        return EMPTY;
    }

    static add<O, I, A = never>(): AddFunction<O, I, A, ProgressCountPart<O, I>> {
        return createAdd(new ProgressCountPart());
    }

    static select<O, I, A = never>(): SelectFunction<ProgressCountPart<O, I>, A, number> {
        return createSelect(ProgressCountPart, (v) => v.count, { startValue: 0 });
    }
}
