import { describe, expect, jest, test } from "@jest/globals";
import { useState } from "../../src/store/store";
import { deepCopy } from "../../src/store/assign";

describe("Taihou Store", () => {
    const defaultState = {
        count: 0,
        id: "atago",
        stats: { hp: 500 },
        dict: {} as Record<string, unknown>, // Should support this!!!!
    };
    const deepCopyDefaultState = deepCopy(defaultState);

    const storeOptions = { debug: true };

    const atago = useState({
        options: { ...storeOptions, name: "atago" },
        state: defaultState,
        actions: {
            count: (state, payload: number) => ({ ...state, count: payload }),
            setId: (state, payload: string) => ({ ...state }),
            setStats: (state, payload: { hp: number }) => ({
                ...state,
                stats: { ...state.stats, ...payload },
            }),
            addToDict: (state, payload: string) => ({
                ...state,
                dict: { ...state.dict, [payload]: payload },
            }),
            resetDict: (state) => ({ ...state, dict: {} }),
        },
        getters: {
            getStats: (state) => state.stats,
            getStatsWithPayload: (state, payload: { someCustomType: string }) =>
                state.stats.hp + payload.someCustomType,
        },
    });
    const azuma = useState({
        options: { ...storeOptions, name: "azuma" },
        state: defaultState,
        actions: {
            setId: (state, payload: string) => ({ ...state, id: payload }),
        },
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
            azuma.actions.setId("azumama");

            expect(reusable).toHaveBeenCalledTimes(1);
        });

        test("Provided default state should not mutate", () => {
            const { setId, setStats } = atago.actions;

            setId("taihou");
            setStats({ hp: 250 });

            // Provided default state should not mutate
            expect(defaultState).toStrictEqual(deepCopyDefaultState);
        });

        test("Add/Remove properties should not break the reactivity", () => {
            const reusable = jest.fn();

            atago.watch(reusable);

            const { addToDict, resetDict } = atago.actions;

            const newState = addToDict("test");

            expect(newState.dict).toStrictEqual({ ["test"]: "test" });
            expect(reusable).toHaveBeenCalledTimes(1);

            const atagoState = atago.getState();
            expect(atagoState.dict).toHaveProperty("test");

            resetDict();

            expect(reusable).toHaveBeenCalledTimes(2);
            const atagoState2 = atago.getState();
            expect(atagoState2.dict).not.toHaveProperty("test");
        });

        test("Actions and Getters", () => {
            const { getters, actions } = atago;

            // This should also return the updated state
            const newState = actions.setStats({ hp: 1000 });

            expect(newState.stats).toStrictEqual({ hp: 1000 });
            expect(getters.getStats()).toStrictEqual({ hp: 1000 });
            expect(
                getters.getStatsWithPayload({ someCustomType: "1" }),
            ).toStrictEqual("10001");
        });
    });
});
