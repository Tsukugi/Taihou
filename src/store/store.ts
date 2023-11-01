import { TaihouOptions, UseState } from "../interfaces";
import { deepCopy, deepProxy, updateNestedValue } from "./assign";
import { createSubscriber } from "./subscribe";

const defaultOptions: TaihouOptions = { name: "store", debug: false };
export const useState = <State extends Record<keyof State, unknown>>(
    state: State,
    options: Partial<TaihouOptions> = defaultOptions,
): UseState<State> => {
    const innerOptions = { ...defaultOptions, ...options };
    const unlinkedState = deepCopy(state);
    const events = createSubscriber<State>();

    const innerState = deepProxy<State>(
        unlinkedState,
        ({ newValue, path, initialObject }) => {
            const updatedObject = updateNestedValue(
                initialObject,
                path,
                newValue,
            );
            innerOptions.debug &&
                console.log(`#${innerOptions.name}: ${path} => ${newValue}`);
            events.publish(updatedObject);
        },
    );

    return [innerState, events.subscribe, events.unsubscribe];
};
