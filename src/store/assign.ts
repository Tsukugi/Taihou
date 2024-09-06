export const deepCopy = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj)) as T;
};
interface OnChangeWrapperProps<T> {
    path: string;
    newValue: T;
    initialObject: T;
}
export const deepProxy = <RootObject extends object>(
    initialObject: RootObject,
    onChangeWrapper: (props: OnChangeWrapperProps<RootObject>) => void,
): RootObject => {
    const proxyCache = new WeakMap();

    const createDeepOnChangeProxy = (
        target: RootObject,
        path: string,
        onChange: (props: OnChangeWrapperProps<RootObject>) => void,
    ) => {
        const addProperty = (property: string) =>
            path !== "" ? `${path}.${property}` : property;

        return new Proxy(target, {
            get(target, property) {
                const key = property as keyof RootObject;
                const item = target[key];
                if (!item || typeof item !== "object") return item;
                if (proxyCache.has(item)) return proxyCache.get(item);
                const proxy = createDeepOnChangeProxy(
                    item as RootObject,
                    addProperty(String(key)),
                    onChange,
                );
                proxyCache.set(item, proxy);
                return proxy;
            },
            set(target, property, newValue) {
                const key = property as keyof RootObject;
                onChange({
                    initialObject,
                    path: addProperty(String(key)),
                    newValue,
                });
                target[key] = newValue;
                return true;
            },
        });
    };

    return createDeepOnChangeProxy(initialObject, "", onChangeWrapper);
};

export const updateNestedValue = <
    RootObject extends Record<keyof RootObject, unknown>,
>(
    initialObject: RootObject,
    path: string,
    newValue: unknown,
): RootObject => {
    const keys = path.split(".");
    const updatedObject: RootObject = { ...initialObject };
    let currentObject: Record<string, unknown> = updatedObject;

    for (let i = 0; i < keys.length - 1; i++) {
        if (
            currentObject[keys[i]] === undefined ||
            typeof currentObject[keys[i]] !== "object"
        ) {
            currentObject[keys[i]] = {};
        }
        currentObject = currentObject[keys[i]] as Record<string, unknown>;
    }

    currentObject[keys[keys.length - 1]] = newValue;

    return updatedObject;
};
