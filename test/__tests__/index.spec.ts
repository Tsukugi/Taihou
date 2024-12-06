import { describe, expect, jest, test } from "@jest/globals";
import { useState } from "../../src/store/store";
import { deepCopy } from "../../src/store/assign";

describe("Taihou Store", () => {
    const defaultState = {
        count: 0,
        id: "atago",
        stats: { hp: 500 },
    };
    const deepCopyDefaultState = deepCopy(defaultState);

    const storeOptions = { debug: true };

    const atago = useState({
        options: { ...storeOptions, name: "atago" },
        state: defaultState,
        actions: {
            count: (state, payload) => ({ ...state, count: payload }),
            setId: (state, payload) => ({ ...state, id: payload }),
            setStats: (state, payload: { hp: number }) =>
                ({ ...state, stats: { ...state.stats, ...payload } })
        },
        getters: {
            getStats: (state) => state.stats
        }
    });
    const azuma = useState({
        options: { ...storeOptions, name: "azuma" },
        state: defaultState,
        actions: {
            setId: (state, payload) => ({ ...state, id: payload }),
        },
        getters: {}
    });

    describe("create a section ", () => {
        test("Is created with a correct state", () => {
            const atagoState = atago.getState();
            expect(atagoState).toHaveProperty("count");
            expect(atagoState).toHaveProperty("id");

            atago.watch((localState) => {
                expect(localState).toHaveProperty("count");
                expect(localState).toHaveProperty("id");
                expect(localState).toHaveProperty("stats");
                expect(localState.stats).toHaveProperty("hp");
            });
        });
    });

    describe("Subscriber Pattern", () => {
        test("Is the state updated", () => {
            const history: number[] = [];

            const updateHistory = ({ count }: { count: number }) => {
                history.push(count);
                expect(history).toContain(count);
            };

            atago.watch(updateHistory);

            const handler = () => {
                atago.watch(({ count }) => {
                    expect(count).toBeGreaterThan(2);
                });
            };

            const { count } = atago.actions;
            count(1);
            count(2);

            handler();
            count(3);
            count(4);

            const atagoState = atago.getState();
            expect(atagoState.count).toStrictEqual(4);
            expect(atagoState).toStrictEqual({ ...defaultState, count: 4 });
        });

        test("The state doesn't side effects with reusable functions", () => {
            const reusable = jest.fn();

            // Same function will be used as only one subscriber
            atago.watch(reusable);
            atago.watch(reusable);
            atago.watch(reusable);

            const { setId, count } = atago.actions;

            count(10000);
            setId("azuma");
            count(6969);
            setId("shinano");

            expect(reusable).toHaveBeenCalledTimes(4);
        });

        test("A different Store State should not have unwanted sideeffects on the first one", () => {
            const reusable = jest.fn();

            atago.watch(reusable);

            const { setId } = atago.actions;
            setId("musashi");

            // Although they share default values a different State should not trigger unwanted sideeffects
            azuma.actions.setId("azumama")

            expect(reusable).toHaveBeenCalledTimes(1);
        });
        test("Provided default state should not mutate", () => {
            const { setId, setStats } = atago.actions;

            setId("taihou");
            setStats({ hp: 250 })

            // Provided default state should not mutate
            expect(defaultState).toStrictEqual(deepCopyDefaultState);
        });
    });
});
