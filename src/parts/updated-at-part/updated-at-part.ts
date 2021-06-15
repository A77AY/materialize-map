import { EMPTY } from "rxjs";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { createSelect, SelectFunction } from "../part/select";

export class UpdatedAtPart<O, I> extends Part<O, I> {
    constructor(public updatedAt?: Date) {
        super();
    }

    create(map: MapNotification<O, I>): ObservableOrValue<UpdatedAtPart<O, I>> {
        if (!map.isStart && map.inner.notification.kind !== "N") return new UpdatedAtPart(new Date());
        return EMPTY;
    }

    static add<O, I, A = never>(): AddFunction<O, I, A, UpdatedAtPart<O, I>> {
        return createAdd(new UpdatedAtPart());
    }

    static select<O, I, A = never>(): SelectFunction<UpdatedAtPart<O, I>, A, Date> {
        return createSelect(UpdatedAtPart, (v) => v.updatedAt, { filter: (v) => !!v });
    }
}
