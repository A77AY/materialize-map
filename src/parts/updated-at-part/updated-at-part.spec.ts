import * as MockDate from "mockdate";
import { rxSandbox } from "rx-sandbox";
import { of } from "rxjs";

import { MapNotification } from "../../materialize-map";
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
        const expected = e("-(snc)-|", {
            s: new Map<any, any>([
                [MapNotification, VALUES.s],
                [UpdatedAtPart, new UpdatedAtPart()],
            ]),
            n: new Map<any, any>([
                [MapNotification, VALUES.n],
                [UpdatedAtPart, new UpdatedAtPart()],
            ]),
            c: new Map<any, any>([
                [MapNotification, VALUES.c],
                [UpdatedAtPart, new UpdatedAtPart(new Date())],
            ]),
        });
        marbleAssert(getMessages(actual)).to.equal(expected as any);
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
