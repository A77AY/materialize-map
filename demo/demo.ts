// eslint-disable-next-line import/order
import { matMergeMap, ProgressPart, UpdatedAtPart, combineParts, ValuePart, ErrorPart } from "../src";
import { merge, of } from "rxjs";
import { delay, share } from "rxjs/operators";

const helloUser$$ = merge(of("Ray"), of("Ellie").pipe(delay(50))).pipe(
    matMergeMap((name) => of(`Hello, ${name}!`).pipe(delay(100))),
    ValuePart.add(),
    ErrorPart.add(),
    ProgressPart.add(),
    UpdatedAtPart.add(),
    combineParts(),
    share()
);
const helloUser$ = helloUser$$.pipe(ValuePart.select());
const error$ = helloUser$$.pipe(ErrorPart.select());
const inProgress$ = helloUser$$.pipe(ProgressPart.selectInProgress());
const updatedAt$ = helloUser$$.pipe(UpdatedAtPart.select());

const log = (title: string, value: string | number | boolean) => console.log(title.padStart(15, ".") + ": " + value);

inProgress$.subscribe((inProgress) => log("Progress", inProgress));
helloUser$.subscribe((value) => log("Value", value));
error$.subscribe((error) => log("Error", String(error)));
updatedAt$.subscribe((date) => log("Updated At", date.toISOString()));

// .......Progress: false
// .......Progress: true
// ..........Value: Hello, Ray!
// .....Updated At: 2021-06-15T22:33:47.291Z
// ..........Value: Hello, Ellie!
// .....Updated At: 2021-06-15T22:33:47.354Z
// .......Progress: false
