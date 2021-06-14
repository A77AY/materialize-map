import { MapNotification } from "../../materialize-map";
import { AddFunction, createAdd } from "../part/add";
import { Part } from "../part/part";
import { createSelect, SelectFunction } from "../part/select";

export class ProgressPart<O, I> extends Part<O, I, { count: number }> {
    constructor(public count = 0) {
        super({ count });
    }

    create(map: MapNotification<O, I>): ProgressPart<O, I> {
        if (map.isStart) return new ProgressPart(this.count + 1);
        else if (map.inner && map.inner.notification.kind !== "N") return new ProgressPart(this.count - 1);
        return this;
    }

    static add<O, I, A = never>(): AddFunction<O, I, A, ProgressPart<O, I>> {
        return createAdd(new ProgressPart());
    }

    static selectInProgress<O, I>(): SelectFunction<ProgressPart<O, I>, boolean> {
        return createSelect(ProgressPart, (v) => !!v.state.count, { startValue: false });
    }

    static selectProgress<O, I>(): SelectFunction<ProgressPart<O, I>, number> {
        return createSelect(ProgressPart, (v) => v.state.count, { startValue: 0 });
    }
}
