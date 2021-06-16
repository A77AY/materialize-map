import { rxSandbox } from "rx-sandbox";
import { Notification, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { OUTER_A, OUTER_B, VALUES } from "../test/common";
import { matMergeScan } from "./mat-merge-scan";

const { marbleAssert } = rxSandbox;

const SIMPLE_MAT_MERGE_SCAN = matMergeScan((acc, v) => of([...acc, v]), []);
const MERGE_SCAN_VALUES = {
    ...VALUES,
    n: new MapNotification(OUTER_A, { notification: Notification.createNext(["a"]) }),
    N: new MapNotification(OUTER_B, { notification: Notification.createNext(["a", "b"]) }),
    C: new MapNotification(OUTER_B, { notification: Notification.createComplete() }),
};

describe("matMergeScan", () => {
    it("Should only complete", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-|").pipe(SIMPLE_MAT_MERGE_SCAN);
        const expected = e("-(snc|)", {
            s: new MapNotification(),
            n: new MapNotification(undefined, { notification: Notification.createNext([]) }),
            c: new MapNotification(undefined, { notification: Notification.createComplete() }),
        });
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    it("Should next", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAT_MERGE_SCAN);
        const expected = e("-(snc)-|", MERGE_SCAN_VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    it("Should error", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(matMergeScan(() => throwError("e"), []));
        const expected = e("-(se)-|", MERGE_SCAN_VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    describe("Double", () => {
        it("Should double next", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-b-|").pipe(SIMPLE_MAT_MERGE_SCAN);
            const expected = e("-(snc)-(SNC)-|", MERGE_SCAN_VALUES);
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });

        it("Should double next with delays", () => {
            const { hot, getMessages, e, scheduler } = rxSandbox.create(true);
            const actual = hot("-a-b...100...|").pipe(
                matMergeScan((acc, v) => of([...acc, v]).pipe(delay(5, scheduler)), [])
            );
            const expected = e("-s-S--(nc)-(NC)...95...|", {
                ...MERGE_SCAN_VALUES,
                N: new MapNotification(OUTER_B, { notification: Notification.createNext(["b"]) }),
            });
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });

        it("Should double next with double emitions", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-|").pipe(matMergeScan((acc, v) => of([...acc, v], "x"), []));
            const expected = e("-(snxc)-|", {
                ...MERGE_SCAN_VALUES,
                c: new MapNotification(OUTER_A, { notification: Notification.createComplete() }),
            });
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });
    });
});
