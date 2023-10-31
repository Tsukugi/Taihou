import { Options, UseState } from "../interfaces";
import { deepCopy, deepProxy, updateNestedValue } from "./assign";
import { createSubscriber } from "./subscribe";

const defaultOptions: Options = { name: "", debug: false };
export const createStore = <State extends Record<string, unknown>>(
    section: Record<string, State>,
    options: Partial<Options> = defaultOptions,
) => {
    const store: Record<string, UseState<State>> = {};

    Object.keys(section).forEach((sectionName) => {
        const namedOptions = {
            ...defaultOptions,
            name: options.name || sectionName,
        };
        store[sectionName] = useState(section[sectionName], namedOptions);
    });

    return store;
};

export const useState = <State extends Record<string, unknown>>(
    state: State,
    options: Partial<Options> = defaultOptions,
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
