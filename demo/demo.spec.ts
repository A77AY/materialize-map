describe("Demo", () => {
    it("should work", async () => {
        expect(await import("./demo")).toEqual({});
    });
});
