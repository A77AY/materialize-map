import { merge, Observable } from "rxjs";
import { OperatorFunction } from "rxjs/internal/types";
import { publish, scan } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { InstanceSet, Klass } from "../../utils/instance-set";
import { AddFunction } from "../part/add";

type Unobservable<T> = T extends Observable<infer R> ? R : T;

/**
 * The combination is needed to store state
 * Also, each part can return several next and for their asynchronous work you need to combine them
 */
export function combineParts<O, I, A = void, B = void, C = void, D = void, E = void, F = void, G = void>(
    ...partsAdd:
        | []
        | [AddFunction<O, I, A>]
        | [AddFunction<O, I, A>, AddFunction<O, I, B>]
        | [AddFunction<O, I, A>, AddFunction<O, I, B>, AddFunction<O, I, C>]
        | [AddFunction<O, I, A>, AddFunction<O, I, B>, AddFunction<O, I, C>, AddFunction<O, I, D>]
        | [AddFunction<O, I, A>, AddFunction<O, I, B>, AddFunction<O, I, C>, AddFunction<O, I, D>, AddFunction<O, I, E>]
        | [
              AddFunction<O, I, A>,
              AddFunction<O, I, B>,
              AddFunction<O, I, C>,
              AddFunction<O, I, D>,
              AddFunction<O, I, E>,
              AddFunction<O, I, F>
          ]
        | [
              AddFunction<O, I, A>,
              AddFunction<O, I, B>,
              AddFunction<O, I, C>,
              AddFunction<O, I, D>,
              AddFunction<O, I, E>,
              AddFunction<O, I, F>,
              AddFunction<O, I, G>
          ]
): OperatorFunction<
    MapNotification<O, I>,
    InstanceSet<Unobservable<ReturnType<typeof partsAdd[number]> | MapNotification<O, I>>>
> {
    return (src$) =>
        src$.pipe(
            publish((mn$) => merge(mn$, ...partsAdd.map((add) => mn$.pipe(add)))),
            scan((acc, value: MapNotification<O, I> | A) => {
                const key = value?.constructor as Klass<any>;
                if (acc.has(key) && value !== acc.get(key)) acc = new InstanceSet(acc.map);
                acc.set(key, value);
                return acc;
            }, new InstanceSet<Unobservable<ReturnType<typeof partsAdd[number]>> | MapNotification<O, I>>())
        );
}
