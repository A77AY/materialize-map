# Materialize Map Operators

[![npm version](https://badge.fury.io/js/%40materialize-map.svg)](https://badge.fury.io/js/%40materialize-map)

Materialize (inner & outer) maps operators:

-   `matMergeMap()`
-   `matConcatMap()`
-   `matSwitchMap()`
-   `matExhaustMap()`

<!--
TODO:
-   `matMergeScan()`
-->

Dematerialize:

-   `dematerializeMap()`

Data-enriching operators:

-   `ProgressPart()`
    -   `ProgressPart.add()`
    -   `ProgressPart.selectInProgress()`
    -   `ProgressPart.selectProgress()`
-   `UpdatedAtPart()`
    -   `UpdatedAtPart.add()`
    -   `UpdatedAtPart.select()`

## Installation

```sh
npm i materialize-map
```

## Usage

```ts
import { dematerializeMap, matMergeMap, ProgressPart, UpdatedAtPart } from "materialize-map";
import { merge, of } from "rxjs";
import { delay, share } from "rxjs/operators";

const helloUser$$ = merge(of("Ray"), of("Ellie").pipe(delay(50))).pipe(
    matMergeMap((name) => of(`Hello, ${name}!`).pipe(delay(100))),
    ProgressPart.add(),
    UpdatedAtPart.add(),
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
// .....Updated At: 2021-06-14T12:02:57.075Z
// ..........Value: Hello, Ellie!
// .....Updated At: 2021-06-14T12:02:57.123Z
// .......Progress: false
```
