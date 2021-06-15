describe("Demo", () => {
    it("should work", async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(await import("./demo")).toEqual({});
    });
});
