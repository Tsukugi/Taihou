export type Dispatch<State> = (state: State) => State;
export type DispatchRecord<State> = Record<keyof State, Dispatch<State>>;
export type SubscribeAction<T> = (cb: (message: T) => void) => void;

export interface Section<State> {
    readonly state: State;
    readonly watch: SubscribeAction<State>;
}
