import { rxSandbox } from "rx-sandbox";
import { distinctUntilChanged } from "rxjs/operators";

import { MapNotification } from "../../materialize-map";
import { SIMPLE_MAT_MAP, VALUES } from "../../operators/test/common";
import { InstanceSet } from "../../utils/instance-set";
import { ProgressPart } from "../progress-part/progress-part";
import { combineParts } from "./combine-parts";

const { marbleAssert } = rxSandbox;

describe("combineParts", () => {
    it("should be combined MapNotification", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAT_MAP, combineParts());
        const expected = e("-(snc)-|", {
            s: new InstanceSet([[MapNotification, VALUES.s]] as const),
            n: new InstanceSet([[MapNotification, VALUES.n]] as const),
            c: new InstanceSet([[MapNotification, VALUES.c]] as const),
        });
        const r = getMessages(actual);
        marbleAssert(r).to.equal(expected);
    });

    it("should be combined MapNotification with parts", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAT_MAP, combineParts(ProgressPart.add()));
        const s = [MapNotification, VALUES.s] as any;
        const n = [MapNotification, VALUES.n] as any;
        const c = [MapNotification, VALUES.c] as any;
        const P = [ProgressPart, new ProgressPart(1)] as any;
        const R = [ProgressPart, new ProgressPart(0)] as any;
        const expected = e("-(sPncR)-|", {
            s: new InstanceSet([s, P]), // added after s and P equal
            P: new InstanceSet([s, P]),
            n: new InstanceSet([n, P]),
            c: new InstanceSet([c, P]),
            R: new InstanceSet([c, R]),
        });
        const r = getMessages(actual);
        marbleAssert(r).to.equal(expected as any);
    });

    it("should be combined MapNotification with parts distinctUntilChanged", () => {
        const { hot, getMessages, e } = rxSandbox.create(true);
        const actual = hot("-a-|").pipe(SIMPLE_MAT_MAP, combineParts(ProgressPart.add()), distinctUntilChanged());
        const s = [MapNotification, VALUES.s] as any;
        const n = [MapNotification, VALUES.n] as any;
        const c = [MapNotification, VALUES.c] as any;
        const P = [ProgressPart, new ProgressPart(1)] as any;
        const R = [ProgressPart, new ProgressPart(0)] as any;
        const expected = e("-(sncR)-|", {
            s: new InstanceSet([s, P]),
            n: new InstanceSet([n, P]),
            c: new InstanceSet([c, P]),
            R: new InstanceSet([c, R]),
        });
        const r = getMessages(actual);
        marbleAssert(r).to.equal(expected as any);
    });
});
