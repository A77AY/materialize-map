import { rxSandbox } from "rx-sandbox";
import { of } from "rxjs";

import { matConcatMap } from "../../operators";
import { VALUES } from "../../operators/test/common";
import { ProgressPart } from "./progress-part";

const { marbleAssert } = rxSandbox;

describe("ProgressPart", () => {
    const SIMPLE_MAP = matConcatMap((v) => of(v));

    it("Should next", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAP, ProgressPart.add());
        const expected = e("-(sancb)-|", {
            ...VALUES,
            a: new ProgressPart(1),
            b: new ProgressPart(0),
        });
        marbleAssert(getMessages(actual)).to.equal(expected);
    });

    describe("select", () => {
        it("Should return 0-1-0", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-|").pipe(SIMPLE_MAP, ProgressPart.add(), ProgressPart.select());
            const expected = e("0(10)-|", {
                [1]: 1,
                [0]: 0,
            });
            marbleAssert(getMessages(actual)).to.equal(expected);
        });
    });
});
