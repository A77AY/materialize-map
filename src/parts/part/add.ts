import { OperatorFunction } from "rxjs/internal/types";
import { defaultIfEmpty, map, mergeScan } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { createObservable } from "../../utils/create-observable";
import { Part } from "./part";

export type ClassKeyMap<V extends InstanceType<any>> = Map<{ new (...args: any): V }, V>;
export type MapOrValue<V> = V | ClassKeyMap<V>;

export type AddFunction<O, I, A, B> = OperatorFunction<
    MapOrValue<MapNotification<O, I> | A>,
    ClassKeyMap<MapNotification<O, I> | A | B>
>;

export function createAdd<O, I, B extends Part<unknown, unknown, unknown>, A = never>(
    PartClass: { new (): B },
    seed: B
): AddFunction<O, I, A, B> {
    return (src$) =>
        src$.pipe(
            map((value) => (value instanceof Map ? value : new Map([[MapNotification, value]]))),
            mergeScan<ClassKeyMap<any>, ClassKeyMap<any>>(
                (prevMap, nextMap) => {
                    nextMap.set(PartClass, prevMap.get(PartClass));
                    return createObservable(prevMap.get(PartClass).create(nextMap.get(MapNotification))).pipe(
                        map((part) => {
                            nextMap.set(PartClass, part);
                            return nextMap;
                        }),
                        defaultIfEmpty(nextMap)
                    );
                },
                new Map([[PartClass, seed]]),
                1
            )
        );
}
