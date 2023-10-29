export type SubscribeAction<T> = (cb: (message: T) => void) => void;

export interface Section<State> {
    readonly state: State;
    readonly watch: SubscribeAction<State>;
}
