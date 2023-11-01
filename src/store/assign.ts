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
        const addProperty = (property) =>
            path !== "" ? `${path}.${property}` : property;

        return new Proxy(target, {
            get(target, property) {
                const item = target[property as string];
                if (!item || typeof item !== "object") return item;
                if (proxyCache.has(item)) return proxyCache.get(item);
                const proxy = createDeepOnChangeProxy(
                    item as RootObject,
                    addProperty(property),
                    onChange,
                );
                proxyCache.set(item, proxy);
                return proxy;
            },
            set(target, property: string, newValue) {
                onChange({
                    initialObject,
                    path: addProperty(property),
                    newValue,
                });
                (target as unknown)[property] = newValue;
                return true;
            },
        });
    };

    return createDeepOnChangeProxy(initialObject, "", onChangeWrapper);
};

export const updateNestedValue = <T>(
    initialObject: T,
    path: string,
    newValue: unknown,
): T => {
    const keys = path.split(".");
    const updatedObject: T = { ...initialObject };
    let currentObject: T = updatedObject;

    for (let i = 0; i < keys.length - 1; i++) {
        if (
            currentObject[keys[i]] === undefined ||
            typeof currentObject[keys[i]] !== "object"
        ) {
            currentObject[keys[i]] = {};
        }
        currentObject = currentObject[keys[i]];
    }

    currentObject[keys[keys.length - 1]] = newValue;

    return updatedObject;
};
