import { rxSandbox } from "rx-sandbox";
import { Notification, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { OUTER_A, VALUES } from "../test/common";
import { matSwitchMap } from "./mat-switch-map";

const { marbleAssert } = rxSandbox;

describe("matSwitchMap", () => {
    const SIMPLE_MAT_SWITCH_MAP: any = matSwitchMap((v) => of(v));

    it("Should only complete", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-|").pipe(SIMPLE_MAT_SWITCH_MAP);
        const expected = e("-|", VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected);
    });

    it("Should next", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAT_SWITCH_MAP);
        const expected = e("-(snc)-|", VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected);
    });

    it("Should double next with double emitions", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(matSwitchMap((v) => of(v, "x")));
        const expected = e("-(snxc)-|", {
            ...VALUES,
            c: new MapNotification(OUTER_A, { notification: Notification.createComplete() }),
        });
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    it("Should error", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(matSwitchMap(() => throwError("e")));
        const expected = e("-(se)-|", VALUES);
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    describe("Double", () => {
        it("Should double next", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-b-|").pipe(SIMPLE_MAT_SWITCH_MAP);
            const expected = e("-(snc)-(SNC)-|", VALUES);
            marbleAssert(getMessages(actual)).to.equal(expected);
        });

        it("Should switched double next with delays", () => {
            const { hot, getMessages, e, scheduler } = rxSandbox.create(true);
            const actual = hot("-a-b...100...|").pipe(matSwitchMap((v) => of(v).pipe(delay(5, scheduler))));
            const expected = e("-s-(c S)----(NC)...95...|", {
                ...VALUES,
                c: new MapNotification(OUTER_A, { notification: Notification.createComplete() }),
            });
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });

        it("Should switched double together next with delays", () => {
            const { hot, getMessages, e, scheduler } = rxSandbox.create(true);
            const actual = hot("-(ab)...100...|").pipe(matSwitchMap((v) => of(v).pipe(delay(5, scheduler))));
            const expected = e("-(sc S)----(NC)...95...|", {
                ...VALUES,
                c: new MapNotification(OUTER_A, { notification: Notification.createComplete() }),
            });
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });
    });
});
