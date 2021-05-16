import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { createAdd } from "./add";

export abstract class Part<O, I, S = void> {
    protected constructor(public state: S) {}

    abstract create(map: MapNotification<O, I>): ObservableOrValue<Part<O, I, S>>;

    static add(): ReturnType<typeof createAdd> {
        return null;
    }
}
