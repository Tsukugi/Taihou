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

export const injectStructure = <
    Structure extends GenericObject<any>,
    DispatchRecord extends {
        [key in keyof DispatchRecord]: Dispatch<
            Structure,
            ReturnType<DispatchRecord[key]>,
            DispatchPayload<DispatchRecord[key]>
        >;
    } = Record<string, Dispatch<Structure>>,
    Return = ReturnType<DispatchRecord[keyof DispatchRecord]>,
>(
    getStructure: () => Structure,
    record: DispatchRecord,
    interceptor?: Dispatch<Structure, Structure, Return>,
) =>
    Object.keys(record).reduce((acc, key) => {
        const dispatchFn: Dispatch<Structure, Return> = (record as any)[key];
        const getter: Getter<any, Return> = (payload) => {
            const oldStructure = getStructure();
            const newStructure = dispatchFn(oldStructure, payload);
            interceptor && interceptor(oldStructure, newStructure);
            return newStructure;
        };

        (acc as any)[key] = getter;
        return acc;
    }, {} as MapDispatchToGetter<DispatchRecord>);
