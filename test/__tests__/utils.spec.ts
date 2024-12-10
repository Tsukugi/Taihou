import { describe, expect, jest, test } from "@jest/globals";

import { deepCopy } from "../../src/store/assign";

describe("Taihou Store", () => {
    describe("Deep Copy ", () => {
        test("Deep copy doesnt have side effects", () => {
            const defaultState = {
                count: 0,
                id: "atago",
                stats: { hp: 500 },
            };
            const deepCopiedValue = deepCopy(defaultState);
            deepCopiedValue.count = 1;
            deepCopiedValue.stats.hp = 1000;
            expect(deepCopiedValue).not.toEqual(defaultState);
        });
    });
});
