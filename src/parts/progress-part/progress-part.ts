import { EMPTY } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { getPart, SelectFunction } from "../part/select";

export class ProgressPart implements Part {
    constructor(public count = 0) {}

    create(map: MapNotification): ObservableOrValue<ProgressPart> {
        if (map.isStart) return new ProgressPart(this.count + 1);
        else if (map.inner && map.inner.notification.kind !== "N") return new ProgressPart(this.count - 1);
        return EMPTY;
    }

    static add<O, I>(): AddFunction<O, I, ProgressPart> {
        return (src$) => src$.pipe(createAdd(new ProgressPart()));
    }

    static select<A = never>(): SelectFunction<ProgressPart, A, number> {
        return (src$) =>
            src$.pipe(
                getPart(ProgressPart),
                map((v) => v.count),
                startWith(0)
            );
    }
}
