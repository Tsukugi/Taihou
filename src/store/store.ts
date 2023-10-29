import { SubscribeAction } from "../interfaces";
import { deepCopy } from "./deepCopy";
import { createSubscriber } from "./subscribe";

export const createStore = () => {
    const register = <State extends Record<string, any>>(
        state: State,
    ): {
        state: State;
        watch: SubscribeAction<State>;
    } => {
        const events = createSubscriber<State>();
        let innerState = deepCopy(state) as State;
        const setProxyState = new Proxy(innerState, {
            set: (state, key, newValue, receiver) => {
                const newState = { ...receiver, [key]: newValue };

                events.publish(newState);

                // The default behavior to store the value
                (state as any)[key] = newValue;
                return true;
            },
            get: (state, key, receiver) => {
                // The default behavior to get the state
                return (state as any)[key];
            },
        });

        return { state: setProxyState, watch: events.subscribe };
    };

    const useState = <State extends Record<string, any>>(
        defaultState: State,
    ): [State, SubscribeAction<State>] => {
        const { state, watch } = register(defaultState);
        return [state, watch];
    };

    return { useState };
};