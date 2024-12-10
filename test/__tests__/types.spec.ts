
import { describe, expect, test } from "@jest/globals";
import { injectStructure } from "../../src/store/assign";
import { MapDispatchToGetter } from "../../src/interfaces";
import { useState } from "../../src/store/store";

describe("Types", () => {
    test("MapDispatchToGetter infers types correctly", () => {
        const _state = {
            asd: true,
            a: 10
        }

        const record = {
            test: (state: typeof _state, payload: number) => state.a + payload,
            test2: (state: number) => false
        }

        const res: MapDispatchToGetter<typeof record> = {
            test: (payload) => 10 + payload,
            test2: (payload) => true
        }
        res.test(1);
    });
    test("injectStructure infers types correctly", () => {
        const structure = injectStructure(
            () => ({
                count: 0,
                nest: { a: true }
            }),
            {
                add: (state) => ({ ...state, count: state.count++ }),
                replace: (state, payload: number) => ({ ...state, count: payload }),
                nestMod: (state, payload: { a: boolean }) =>
                    ({ ...state, nest: { ...state.nest, ...payload } }),
                otherModifier: (state, payload: string[]) =>
                    ({ ...state, nest: { ...state.nest, ...payload } })
            },
        )

        structure.replace(10);
        structure.otherModifier([]);
    })

    test("Taihou does infer correctly", () => {
        const taihou = useState({
            state: {
                count: 0,
            },
            actions: {
                doTest: (state, payload) => state,
                doAnotherTest: (state, payload: number) => ({ ...state, count: payload }),
            },
            getters: {
                getTest: (state, payload) => state.count,
                getAnotherTest: (state, payload: number) => payload,
            }
        })
        expect(taihou.getState()).toStrictEqual({ count: 0 });
        expect(taihou.actions).toHaveProperty("doTest");
        expect(taihou.actions.doTest(null)).toStrictEqual({ count: 0 });
        expect(taihou.getters.getTest(null)).toBe(0);
        expect(taihou.getters.getAnotherTest(100)).toBe(100);

        expect(taihou.actions.doAnotherTest(1)).toStrictEqual({ count: 1 });
        // State should be updated so we check if so
        expect(taihou.getters.getTest(null)).toStrictEqual(1);

    })
})