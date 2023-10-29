export interface StoreInstance<Store> {
    readonly store: Store;
    useStore: (setup: (instance: Store) => any) => any;
}

export const createStore = <Store>(store: Store): StoreInstance<Store> => {
    // Freeze store and sections (Not deep, just 3 levels)
    Object.keys(store).forEach((sectionName) => {
        Object.freeze(store[sectionName]);
    });
    Object.freeze(store);

    return {
        useStore: (setup) => setup(store),
        store,
    };
};
