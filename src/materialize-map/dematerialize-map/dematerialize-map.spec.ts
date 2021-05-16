import { rxSandbox } from "rx-sandbox";
import { of, throwError } from "rxjs";
import { delay } from "rxjs/operators";

import { SIMPLE_MAT_MAP, testMatMap } from "../../operators/test/common";
import { dematerializeMap } from "./dematerialize-map";

const { marbleAssert } = rxSandbox;

describe("dematerializeMap", () => {
    const MAT_DEMAT = [SIMPLE_MAT_MAP, dematerializeMap()] as const;

    it("Should only complete", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-|").pipe(...MAT_DEMAT);
        const expected = e("-|");
        marbleAssert(getMessages(actual)).to.equal(expected);
    });

    it("Should next", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(...MAT_DEMAT);
        const expected = e("-a-|");
        marbleAssert(getMessages(actual)).to.equal(expected);
    });

    it("Should error", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(
            testMatMap(() => throwError("e")),
            dematerializeMap()
        );
        const expected = e("-#", null, "e");
        marbleAssert(getMessages(actual)).to.equal(expected as any);
    });

    describe("Double", () => {
        it("Should double next", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-b-|").pipe(...MAT_DEMAT);
            const expected = e("-a-b-|");
            marbleAssert(getMessages(actual)).to.equal(expected);
        });

        it("Should double next with delays", () => {
            const { hot, getMessages, e, scheduler } = rxSandbox.create(true);
            const actual = hot("-a-b...100...|").pipe(
                testMatMap((v) => of(v).pipe(delay(5, scheduler))),
                dematerializeMap()
            );
            const expected = e("------a-b...95...|");
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });

        it("Should double next with double emitions", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            const actual = hot("-a-|").pipe(
                testMatMap((v) => of(v, "x")),
                dematerializeMap()
            );
            const expected = e("-(ax)-|");
            marbleAssert(getMessages(actual)).to.equal(expected as any);
        });
    });
});
