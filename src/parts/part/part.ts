import { MapNotification } from "../../materialize-map";
import { ObservableOrValue } from "../../utils/create-observable";

export interface Part {
    create(map: MapNotification): ObservableOrValue<unknown>;
}
