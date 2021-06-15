// eslint-disable-next-line import/order
import { dematerializeMap, matMergeMap, ProgressPart, UpdatedAtPart, combineParts } from "../src";
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
