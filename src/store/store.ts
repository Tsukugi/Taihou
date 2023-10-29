import { Options, SubscribeAction, UseState } from "../interfaces";
import { deepCopy } from "./deepCopy";
import { createSubscriber } from "./subscribe";

const register = <State extends Record<string, any>>(
    state: State,
    options: Options,
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
            options.debug && console.log(newState);
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

export const useState = <State extends Record<string, any>>(
    initialState: State,
    options: Options = { debug: false },
): UseState<State> => {
    const { state, watch } = register(initialState, options);
    return [state, watch];
};
