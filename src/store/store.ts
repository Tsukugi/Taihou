import {
    MapDispatchToGetter, GenericObject, TaihouOptions, TaihouState, UseStateProps,
    GenericDispatch,
    Dispatch,
} from "../interfaces";
import { deepCopy, injectStructure } from "./assign";
import { createSubscriber } from "./subscribe";

const defaultOptions: TaihouOptions = { name: "store", debug: false };
export type UseState = typeof useState;
export const useState =
    <
        State extends GenericObject<State>,
        Actions extends GenericDispatch<State, Actions> = Record<string, Dispatch<State, State>>,
        Getters extends GenericDispatch<State, Getters> = Record<string, Dispatch<State>>
    >({
        options,
        state,
        actions,
        getters
    }: UseStateProps<State, Actions, Getters>): TaihouState<
        State,
        MapDispatchToGetter<Actions>,
        MapDispatchToGetter<Getters>
    > => {

        const innerActions: Actions = actions || {} as Actions;
        const innerGetters: Getters = getters || {} as Getters;
        const innerOptions = { ...defaultOptions, ...options };
        let unlinkedState = deepCopy(state);
        const events = createSubscriber<State>();
        const getState = () => deepCopy(unlinkedState);
        const linkedActions = injectStructure<State, Actions, State>(
            getState,
            innerActions,
            (oldState, newState) => {
                if (innerOptions.debug) console.log({ oldState, newState })
                Object.assign(unlinkedState, newState);
                events.publish(newState);
                return unlinkedState;
            })
        const linkedGetters = injectStructure(
            getState,
            innerGetters);

        return {
            getState,
            actions: linkedActions,
            getters: linkedGetters,
            watch: events.subscribe,
            unwatch: events.unsubscribe
        }
    };