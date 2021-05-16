import { EMPTY } from "rxjs";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { createSelect, SelectFunction } from "../part/select";

export class UpdatedAtPart<O, I> extends Part<O, I, { updatedAt: Date }> {
    constructor(public updatedAt?: Date) {
        super({ updatedAt });
    }

    create(map: MapNotification<O, I>): ObservableOrValue<UpdatedAtPart<O, I>> {
        if (!map.isStart && map.inner.notification.kind !== "N") return new UpdatedAtPart(new Date());
        return EMPTY;
    }

    static add<O, I, A = never>(): AddFunction<O, I, A, UpdatedAtPart<O, I>> {
        return createAdd(new UpdatedAtPart());
    }

    static select<O, I>(): SelectFunction<UpdatedAtPart<O, I>, Date> {
        return createSelect(UpdatedAtPart, (v) => v.state.updatedAt);
    }
}
