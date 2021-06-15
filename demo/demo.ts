// eslint-disable-next-line import/order
import { matMergeMap, ProgressCountPart, UpdatedAtPart, combineParts, ValuePart, ErrorPart } from "../src";
import { merge, of } from "rxjs";
import { delay, share } from "rxjs/operators";

const helloUser$$ = merge(of("Ray"), of("Ellie").pipe(delay(50))).pipe(
    matMergeMap((name) => of(`Hello, ${name}!`).pipe(delay(100))),
    ValuePart.add(),
    ErrorPart.add(),
    ProgressCountPart.add(),
    UpdatedAtPart.add(),
    combineParts(),
    share()
);
const helloUser$ = helloUser$$.pipe(ValuePart.select());
const error$ = helloUser$$.pipe(ErrorPart.select());
const inProgress$ = helloUser$$.pipe(ProgressCountPart.select());
const updatedAt$ = helloUser$$.pipe(UpdatedAtPart.select());

const log = (title: string, value: string | number | boolean) => console.log(title.padStart(20, ".") + ": " + value);

inProgress$.subscribe((count) => log("Progress Count", count));
helloUser$.subscribe((value) => log("Value", value));
error$.subscribe((error) => log("Error", String(error)));
updatedAt$.subscribe((date) => log("Updated At", date.toISOString()));

// ......Progress Count: 0
// ......Progress Count: 1
// ......Progress Count: 2
// ...............Value: Hello, Ray!
// ..........Updated At: 2021-06-15T22:45:41.927Z
// ......Progress Count: 1
// ...............Value: Hello, Ellie!
// ..........Updated At: 2021-06-15T22:45:41.989Z
// ......Progress Count: 0
