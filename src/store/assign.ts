import {
    Dispatch,
    DispatchPayload,
    GenericObject,
    Getter,
    MapDispatchToGetter,
} from "../interfaces";

export const deepCopy = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj)) as T;
};

export const injectState = <
    State extends GenericObject<unknown>,
    DispatchRecord extends {
        [key in keyof DispatchRecord]: Dispatch<
            State,
            ReturnType<DispatchRecord[key]>,
            DispatchPayload<DispatchRecord[key]>
        >;
    } = Record<string, Dispatch<State>>,
>(
    getState: () => State,
    record: DispatchRecord,
    interceptor?: (props: {
        oldState: State;
        result: ReturnType<DispatchRecord[keyof DispatchRecord]>;
    }) => void,
) =>
    Object.keys(record).reduce((acc, key) => {
        const dispatchFn = record[key as keyof DispatchRecord] as Dispatch<
            State,
            ReturnType<DispatchRecord[keyof DispatchRecord]>
        >;
        const getter = (
            payload: DispatchPayload<DispatchRecord[keyof DispatchRecord]>,
        ): ReturnType<DispatchRecord[keyof DispatchRecord]> => {
            const oldState = getState();
            const result = dispatchFn(oldState, payload);
            interceptor && interceptor({ oldState, result });
            return result;
        };

        acc[key as keyof DispatchRecord] = getter as Getter<
            DispatchPayload<DispatchRecord[keyof DispatchRecord]>,
            ReturnType<DispatchRecord[keyof DispatchRecord]>
        >;
        return acc;
    }, {} as MapDispatchToGetter<DispatchRecord>);
