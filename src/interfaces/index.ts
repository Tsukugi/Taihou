/* eslint-disable @typescript-eslint/no-explicit-any */

export type SubscribeAction<State> = (
    onUpdate: (state: State) => void,
) => (state: State) => void;

export type TaihouState<State, Actions, Getters> = {
    getState: () => State;
    actions: Actions;
    getters: Getters;
    watch: SubscribeAction<State>;
    unwatch: SubscribeAction<State>;
};

export interface TaihouOptions {
    name: string;
    debug: boolean;
}

export type UseStateProps<State, Actions, Getters> = {
    state: State;
    actions?: Actions;
    getters?: Getters;
    options?: TaihouOptions;
};

export type GenericObject<T> = { [K in keyof T]: T[K] };
export type GenericDispatch<
    Structure,
    Map extends Record<keyof Map, Dispatch>,
    SingleReturn = any,
> = {
    [key in keyof Map]: Dispatch<
        Structure,
        SingleReturn & ReturnType<Map[key]>,
        DispatchPayload<Map[key]>
    >;
};

export type Dispatch<
    Structure = any,
    Return extends ReturnType<Dispatch> = any,
    Payload = any,
> = (structure: Structure, payload: Payload) => Return;

export type Getter<P, R> = P extends NonUndefined<P>
    ? (payload: P) => R
    : () => R;
export type DispatchPayload<D extends Dispatch> = Parameters<D>[1];

export type MapDispatchToGetter<
    Source extends {
        [key in keyof Source]: Dispatch<any, ReturnType<Source[key]>>;
    },
> = {
    [key in keyof Source]: Getter<
        DispatchPayload<Source[key]>,
        ReturnType<Source[key]>
    >;
};

export type NonUndefined<T> = T extends undefined ? never : T;
