import { describe, expect, jest, test } from "@jest/globals";
import { useState } from "../../src/index";
import { deepCopy } from "../../src/store/deepCopy";

describe("Taihou Store", () => {
    const defaultState = {
        count: 0,
        id: "atago",
        stats: { hp: 500 },
    };
    const checkSideEffectsOnState = deepCopy(defaultState);

    const [atagoState, atagoWatch] = useState(defaultState);
    const [azumaState, azumaWatch] = useState(defaultState);

    describe("create a section ", () => {
        test("Is created with a correct state", () => {
            expect(atagoState).toHaveProperty("count");
            expect(atagoState).toHaveProperty("id");

            atagoWatch((localState) => {
                expect(localState).toHaveProperty("count");
                expect(localState).toHaveProperty("id");
            });
        });
    });

    describe("Subscriber Pattern", () => {
        test("Is the state updated", () => {
            let history: any[] = [];
            atagoWatch(({ count }) => {
                history.push(count);
                expect(history).toContain(count);
            });
            atagoState.count = 1;
            atagoState.count = 2;
            atagoState.count = 3;
            atagoState.count = 4;
            expect(atagoState.count).toStrictEqual(4);
            expect(atagoState).toStrictEqual({ ...defaultState, count: 4 });
        });

        test("The state doesn't side effects with reusable functions", () => {
            const reusable = jest.fn();

            // Same function will be used as only one subscriber
            atagoWatch(reusable);
            atagoWatch(reusable);
            atagoWatch(reusable);

            atagoState.count = 10000;
            atagoState.id = "azuma";
            atagoState.count = 6969;
            atagoState.id = "shinano";

            expect(reusable).toHaveBeenCalledTimes(4);
        });

        test("A different Store State should not have unwanted sideeffects on the first one", () => {
            const reusable = jest.fn();
            atagoWatch(reusable);
            atagoState.id = "shinano";

            // Although they share default values a different State should not trigger unwanted sideeffects
            azumaState.id = "azumama";

            expect(reusable).toHaveBeenCalledTimes(1);
        });
        test("Provided default state should not mutate", () => {
            atagoState.id = "shinano";

            // Provided default state should not mutate
            expect(defaultState).toStrictEqual(checkSideEffectsOnState);
        });
    });
});
