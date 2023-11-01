export type SubscribeAction<State> = (
    onUpdate: (state: State) => void,
) => (state: State) => void;

export type UseState<State> = [
    State,
    SubscribeAction<State>,
    SubscribeAction<State>,
];

export interface TaihouOptions {
    name: string;
    debug: boolean;
}
