import { describe, expect, jest, test } from "@jest/globals";
import { createStore } from "../../src/store/store";
import { deepCopy } from "../../src/store/assign";

describe("Taihou Store", () => {
    const defaultState = {
        count: 0,
        id: "atago",
        stats: { hp: 500 },
    };
    const deepCopyDefaultState = deepCopy(defaultState);

    const storeOptions = { debug: true };
    const { atago, azuma } = createStore(
        { atago: defaultState, azuma: defaultState },
        storeOptions,
    );

    const [atagoState, atagoWatch] = atago;
    const [azumaState, azumaWatch] = azuma;

    describe("create a section ", () => {
        test("Is created with a correct state", () => {
            expect(atagoState).toHaveProperty("count");
            expect(atagoState).toHaveProperty("id");

            atagoWatch((localState) => {
                expect(localState).toHaveProperty("count");
                expect(localState).toHaveProperty("id");
                expect(localState).toHaveProperty("stats");
                expect(localState.stats).toHaveProperty("hp");
            });
        });
    });

    describe("Subscriber Pattern", () => {
        test("Is the state updated", () => {
            let history: any[] = [];

            const updateHistory = ({ count }) => {
                history.push(count);
                expect(history).toContain(count);
            };

            atagoWatch(updateHistory);

            const handler = () => {
                atagoWatch(({ count }) => {
                    expect(count).toBeGreaterThan(2);
                });
            };

            atagoState.count = 1;
            atagoState.count = 2;

            handler();

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
            atagoState.id = "musashi";

            // Although they share default values a different State should not trigger unwanted sideeffects
            azumaState.id = "azumama";

            expect(reusable).toHaveBeenCalledTimes(1);
        });
        test("Provided default state should not mutate", () => {
            atagoState.id = "taihou";
            atagoState.stats.hp = 250;

            // Provided default state should not mutate
            expect(defaultState).toStrictEqual(deepCopyDefaultState);
        });
    });
});
