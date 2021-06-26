import { EMPTY } from "rxjs";
import { filter, pluck } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { getPart, SelectFunction } from "../part/select";

export class UpdatedAtPart implements Part {
    constructor(public updatedAt?: Date) {}

    create(map: MapNotification): ObservableOrValue<UpdatedAtPart> {
        if (!map.isStart && map.inner.notification.kind !== "N") return new UpdatedAtPart(new Date());
        return EMPTY;
    }

    static add<O, I>(): AddFunction<O, I, UpdatedAtPart> {
        return (src$) => src$.pipe(createAdd(new UpdatedAtPart()));
    }

    static select<A = never>(): SelectFunction<UpdatedAtPart, A, Date> {
        return (src$) => src$.pipe(getPart(UpdatedAtPart), pluck("updatedAt"), filter(Boolean as (v: Date) => boolean));
    }
}
