# Materialize/Dematerialize Map Operators

[![npm version](https://badge.fury.io/js/materialize-map.svg)](https://badge.fury.io/js/materialize-map)

> Represents all the notifications from the inner source and projected outer `Observable` (from map-something/transform operator) as next emissions marked with their original types within `MapNotification` objects.

Works like [`materialize`](https://rxjs.dev/api/operators/materialize) but for map-something (transform) operators.

**Operators**

-   `matMergeMap()`
-   `matConcatMap()`
-   `matSwitchMap()`
-   `matExhaustMap()`

<!--
TODO:
-   `matMergeScan()`
-->

**Dematerialize**

`dematerializeMap()`

**Parts**

Part operators used for extract information from `MapNotification`s.

-   `ValuePart`
-   `ErrorPart`
-   `ProgressPart`
-   `UpdatedAtPart`

Classes have `.add()` and `.select()` operator methods: `ValuePart.add()`, `ValuePart.select()`.

**Combine**

`combineParts()` - operator for combine `MapNotification` and parts to Map object. Allows to store the last state of all events in one Map object.

**Map Notification**

`MapNotification` contains outer value with index and inner [`Notification`](https://rxjs.dev/api/index/class/Notification) with index.

## Installation

```sh
npm i materialize-map
```

## Example

```ts
import { matMergeMap, ProgressCountPart, UpdatedAtPart, combineParts, ValuePart, ErrorPart } from "materialize-map";
import { merge, of, throwError } from "rxjs";
import { delay, share } from "rxjs/operators";

const helloUser$$ = merge(of("Ray"), of("Ellie").pipe(delay(50)), of("Error").pipe(delay(100))).pipe(
    matMergeMap((name, idx) => {
        if (idx === 2) return throwError(`And hello to you, ${name}!`);
        return of(`Hello, ${name}!`).pipe(delay(100));
    }),
    ValuePart.add(),
    ErrorPart.add(),
    ProgressCountPart.add(),
    UpdatedAtPart.add(),
    combineParts(),
    share()
);

const value$ = helloUser$$.pipe(ValuePart.select());
const error$ = helloUser$$.pipe(ErrorPart.select());
const progressCount$ = helloUser$$.pipe(ProgressCountPart.select());
const updatedAt$ = helloUser$$.pipe(UpdatedAtPart.select());

const log = (title: string, value: string | number | boolean) => console.log(title.padStart(20, ".") + ": " + value);

value$.subscribe((value) => log("Value", value));
error$.subscribe((error) => log("Error", String(error)));
progressCount$.subscribe((count) => log("Progress Count", count));
updatedAt$.subscribe((date) => log("Updated At", date.toISOString()));

// ......Progress Count: 0
// ......Progress Count: 1
// ......Progress Count: 2
// ...............Value: Hello, Ray!
// ..........Updated At: 2021-06-15T23:05:17.131Z
// ......Progress Count: 1
// ......Progress Count: 2
// ..........Updated At: 2021-06-15T23:05:17.133Z
// ......Progress Count: 1
// ...............Error: And hello to you, Error!
// ...............Value: Hello, Ellie!
// ..........Updated At: 2021-06-15T23:05:17.194Z
// ......Progress Count: 0
```
