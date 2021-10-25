export interface StoreInstance<Store> {
  readonly store: Store;
  useStore: (setup: (instance: Store) => any) => any;
}

export const createStore = <Store>(store: Store): StoreInstance<Store> => {
  // Freeze store, sections, and their properties (Not deep, just 3 levels)
  Object.keys(store).forEach(sectionName => {
    const sectionProps = Object.getOwnPropertyNames(store[sectionName]);
    sectionProps.forEach(prop => {
      Object.freeze(store[sectionName][prop]);
    });
    Object.freeze(store[sectionName]);
  });
  Object.freeze(store);

  return {
    useStore: setup => setup(store),
    store,
  };
};
