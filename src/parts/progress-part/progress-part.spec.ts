import { rxSandbox } from "rx-sandbox";
import { of } from "rxjs";

import { MapNotification } from "../../materialize-map";
import { matConcatMap } from "../../operators";
import { VALUES } from "../../operators/test/common";
import { ProgressPart } from "./progress-part";

const { marbleAssert } = rxSandbox;

describe("ProgressPart", () => {
    const SIMPLE_MAP = matConcatMap((v) => of(v));

    it("Should next", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAP, ProgressPart.add());
        const expected = e("-(snc)-|", {
            s: new Map<any, any>([
                [MapNotification, VALUES.s],
                [ProgressPart, new ProgressPart(1)],
            ]),
            n: new Map<any, any>([
                [MapNotification, VALUES.n],
                [ProgressPart, new ProgressPart(1)],
            ]),
            c: new Map<any, any>([
                [MapNotification, VALUES.c],
                [ProgressPart, new ProgressPart(0)],
            ]),
        });
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    describe("ProgressPart.selectInProgress", () => {
        it("Should return false-true-false", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-|").pipe(SIMPLE_MAP, ProgressPart.add(), ProgressPart.selectInProgress());
            const expected = e("0(10)-|", {
                [1]: true,
                [0]: false,
            });
            marbleAssert(getMessages(actual)).to.equal(expected);
        });
    });

    describe("ProgressPart.selectProgress", () => {
        it("Should return 0-1-0", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-|").pipe(SIMPLE_MAP, ProgressPart.add(), ProgressPart.selectProgress());
            const expected = e("0(10)-|", {
                [1]: 1,
                [0]: 0,
            });
            marbleAssert(getMessages(actual)).to.equal(expected);
        });
    });
});
