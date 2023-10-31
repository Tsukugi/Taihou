import { describe, expect, jest, test } from "@jest/globals";

import { deepCopy, updateNestedValue } from "../../src/store/assign";

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

        test("Updates nested values", () => {
            const defaultState = {
                count: 0,
                id: "atago",
                stats: { hp: 500 },
            };

            let updatedValue = updateNestedValue(
                defaultState,
                "stats.hp",
                1000,
            );

            expect(updatedValue.stats.hp).toEqual(1000);

            updatedValue = updateNestedValue(updatedValue, "id", "taihou");

            expect(updatedValue.id).toEqual("taihou");

            updatedValue = updateNestedValue(updatedValue, "count", 10);

            expect(updatedValue.count).toEqual(10);

            updatedValue = updateNestedValue(updatedValue, "id", "azuma");

            expect(updatedValue).toEqual({
                count: 10,
                id: "azuma",
                stats: { hp: 1000 },
            });
        });

        test("Deep proxy", () => {});
    });
});
