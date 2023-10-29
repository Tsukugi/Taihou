import { Section } from "../interfaces";
import { createSubscriber } from "./subscribe";

interface SectionProps<State> {
    state: State;
}

export const createSection = <State extends Record<string, any>>({
    state,
}: SectionProps<State>): Section<State> => {
    const events = createSubscriber<State>();

    const innerState: State = {} as State;
    Object.keys(state).forEach((stateEntryKey: keyof State) => {
        innerState[stateEntryKey] = new Proxy(state[stateEntryKey], {
            set: (state, stateEntryKey, newValue) => {
                events.publish(newValue);
                return true;
            },
            get: (state, stateEntryKey, receiver) => {
                return state[stateEntryKey];
            },
        });
    });

    return {
        state: innerState,
        watch: events.subscribe,
    };
};
