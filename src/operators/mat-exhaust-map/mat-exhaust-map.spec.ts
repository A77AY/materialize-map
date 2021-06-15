import { rxSandbox } from "rx-sandbox";
import { Notification, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { OUTER_A, VALUES } from "../test/common";
import { matExhaustMap } from "./mat-exhaust-map";

const { marbleAssert } = rxSandbox;

describe("matExhaustMap", () => {
    const SIMPLE_MAT_EXHAUST_MAP = matExhaustMap((v) => of(v));

    it("Should only complete", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-|").pipe(SIMPLE_MAT_EXHAUST_MAP);
        const expected = e("-|", VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected);
    });

    it("Should next", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAT_EXHAUST_MAP);
        const expected = e("-(snc)-|", VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected);
    });

    it("Should error", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(matExhaustMap(() => throwError("e")));
        const expected = e("-(se)-|", VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    describe("Double", () => {
        it("Should double next", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-b-|").pipe(SIMPLE_MAT_EXHAUST_MAP);
            const expected = e("-(snc)-(SNC)-|", VALUES);
            marbleAssert(getMessages(actual)).to.equal(expected);
        });

        it("Should double next with delays", () => {
            const { hot, getMessages, e, scheduler } = rxSandbox.create(true);
            const actual = hot("-a-b...100...|").pipe(matExhaustMap((v) => of(v).pipe(delay(5, scheduler))));
            const expected = e("-s----(nc)...97...|", VALUES);
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });

        it("Should double next with double emitions", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-|").pipe(matExhaustMap((v) => of(v, "x")));
            const expected = e("-(snxc)-|", {
                ...VALUES,
                c: new MapNotification(OUTER_A, { notification: Notification.createComplete() }),
            });
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });
    });
});
