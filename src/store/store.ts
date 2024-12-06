import {
    ActionsDef,
    Dispatch,
    GettersDef,
    MapProps,
    SimpleDispatch,
    StateDef,
    TaihouOptions,
    TaihouState,
    UseStateProps,
} from "../interfaces";
import { deepCopy } from "./assign";
import { createSubscriber } from "./subscribe";

const defaultOptions: TaihouOptions = { name: "store", debug: false };
export type UseState = typeof useState;
export const useState = <
    State extends StateDef<State>,
    Actions extends ActionsDef<State>,
    Getters extends GettersDef<State>,
>({
    options,
    state,
    actions,
    getters,
}: UseStateProps<State, Actions, Getters>): TaihouState<
    State,
    MapProps<Actions, SimpleDispatch>,
    MapProps<Getters, SimpleDispatch>
> => {
    const innerOptions = { ...defaultOptions, ...options };
    let unlinkedState = deepCopy(state);
    const events = createSubscriber<State>();
    const getState = () => deepCopy(unlinkedState);
    const linkedActions = injectStructure<
        State,
        Dispatch<State, State>,
        Actions
    >(getState, actions, (oldState, newState) => {
        if (innerOptions.debug) {
            console.log({ name: innerOptions.name, oldState, newState });
        }
        Object.assign(unlinkedState, newState);
        events.publish(newState);
        return unlinkedState;
    });
    const linkedGetters = injectStructure<State, Dispatch<State, any>, Getters>(
        getState,
        getters,
    );
    return {
        getState,
        actions: linkedActions,
        getters: linkedGetters,
        watch: events.subscribe,
        unwatch: events.unsubscribe,
    };
};
const injectStructure = <
    Structure extends { [K in keyof Structure]: Structure[keyof Structure] },
    Executor extends Dispatch<Structure, any>,
    FnRecord extends Record<keyof FnRecord, any>,
>(
    getStructure: () => Structure,
    record: { [K in keyof FnRecord]: Executor },
    interceptor?: Executor,
): MapProps<FnRecord, SimpleDispatch> =>
    Object.keys(record).reduce<MapProps<FnRecord, SimpleDispatch>>(
        (acc, key) => {
            (acc as any)[key] = <T>(payload: T) => {
                const oldStructure = getStructure();
                const newStructure = (record as any)[key](
                    oldStructure,
                    payload,
                );
                interceptor && interceptor(oldStructure, newStructure);
            };
            return acc;
        },
        {} as MapProps<FnRecord, SimpleDispatch>,
    );

const a = injectStructure(
    () => ({
        count: 0,
        nest: { a: true },
    }),
    {
        add: ({ count }) => ({ count: count++ }),
        replace: (state, payload: number) => ({ count: payload }),
        nestMod: (state, payload: { a: boolean }) => ({
            ...state,
            nest: { ...state.nest, ...payload },
        }),
    },
);
a.add("adw");
a.replace();
