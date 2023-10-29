export type SubscribeAction<State> = (onUpdate: (state: State) => void) => void;
export type UseState<State> = [State, SubscribeAction<State>];
export interface Options {
    debug: boolean;
}
