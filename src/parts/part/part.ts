import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";
import { createAdd } from "./add";

export abstract class Part<O = unknown, I = unknown> {
    abstract create(map: MapNotification<O, I>): ObservableOrValue<Part<O, I>>;

    static add(): ReturnType<typeof createAdd> {
        return null;
    }
}
