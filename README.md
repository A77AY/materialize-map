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

-   `ProgressPart()`
    -   `ProgressPart.add()`
    -   `ProgressPart.selectInProgress()`
    -   `ProgressPart.selectProgress()`
-   `UpdatedAtPart()`
    -   `UpdatedAtPart.add()`
    -   `UpdatedAtPart.select()`

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
import { dematerializeMap, matMergeMap, ProgressPart, UpdatedAtPart, combineParts } from "materialize-map";
import { merge, of } from "rxjs";
import { delay, share } from "rxjs/operators";

const helloUser$$ = merge(of("Ray"), of("Ellie").pipe(delay(50))).pipe(
    matMergeMap((name) => of(`Hello, ${name}!`).pipe(delay(100))),
    ProgressPart.add(),
    UpdatedAtPart.add(),
    combineParts(),
    share()
);
const helloUser$ = helloUser$$.pipe(dematerializeMap());
const inProgress$ = helloUser$$.pipe(ProgressPart.selectInProgress());
const updatedAt$ = helloUser$$.pipe(UpdatedAtPart.select());

const log = (title: string, value: string | number | boolean) => console.log(title.padStart(15, ".") + ": " + value);

inProgress$.subscribe((inProgress) => log("Progress", inProgress));
helloUser$.subscribe((value) => log("Value", value));
updatedAt$.subscribe((date) => log("Updated At", date.toISOString()));

// .......Progress: false
// .......Progress: true
// ..........Value: Hello, Ray!
// .....Updated At: 2021-06-15T16:50:18.621Z
// ..........Value: Hello, Ellie!
// .....Updated At: 2021-06-15T16:50:18.682Z
// .......Progress: false
```
