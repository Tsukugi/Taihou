export type SubscribeAction<State> = (
    onUpdate: (state: State) => void,
) => (state: State) => void;

export type TaihouState<State, Actions, Getters> = {
    getState: () => State,
    actions: Actions,
    getters: Getters,
    watch: SubscribeAction<State>,
    unwatch: SubscribeAction<State>,
}
export type UseStateProps<State, Actions, Getters> = {
    state: State,
    actions: Actions,
    getters: Getters,
    options?: TaihouOptions
}


export type MapProps<Obj extends Object, T> = { [K in keyof Obj]: T };
export type SimpleDispatch = <T extends unknown> (payload?: T) => void;
export type Dispatch<Structure, Return, Payload = any> = (structure: Structure, payload: Payload) => Return;

export type StateDef<T = any> = Record<keyof T, T[keyof T]>;
export type ActionsDef<State, T = any, P = any> = Record<keyof T, (state: State, payload: P) => State>;
export type GettersDef<State, T = any, R = any> = Record<keyof T, (state: State) => R>;


export interface TaihouOptions {
    name: string;
    debug: boolean;
}
