// eslint-disable-next-line import/order
import { matMergeMap, ProgressCountPart, UpdatedAtPart, combineParts, ValuePart, ErrorPart } from "../src";
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
