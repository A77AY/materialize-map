import * as MockDate from "mockdate";
import { rxSandbox } from "rx-sandbox";
import { of } from "rxjs";
import { map } from "rxjs/operators";

import { matConcatMap } from "../../operators";
import { VALUES } from "../../operators/test/common";
import { UpdatedAtPart } from "./updated-at-part";

const { marbleAssert } = rxSandbox;

describe("UpdatedAtPart", () => {
    const SIMPLE_MAP = matConcatMap((v) => of(v));

    it("Should next", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        MockDate.set(Date.now());
        const actual = hot("-a-|").pipe(SIMPLE_MAP, UpdatedAtPart.add());
        const expected = e("-(snca)-|", {
            ...VALUES,
            a: new UpdatedAtPart(new Date()),
        });
        marbleAssert(getMessages(actual)).to.equal(expected);
        MockDate.reset();
    });

    describe("select", () => {
        it("Should return current date", () => {
            const { hot, getMessages, e } = rxSandbox.create(true);
            MockDate.set(Date.now());
            const actual = hot("-a-|").pipe(SIMPLE_MAP, UpdatedAtPart.add(), UpdatedAtPart.select());
            const expected = e("-d-|", { d: new Date() });
            marbleAssert(getMessages(actual)).to.equal(expected);
            MockDate.reset();
        });
    });
});
