import { Immutable } from '../interfaces/inmutable';

export interface StoreInstance<Store> {
  readonly store: Immutable<Store>;
  useStore: (setup: (instance: Immutable<Store>) => any) => any;
}

export const createStore = <Store>(store: Store): StoreInstance<Store> => {
  // Freeze store and sections (Not deep)
  Object.keys(store).forEach(sectionName => Object.freeze(store[sectionName]));
  Object.freeze(store);

  return {
    useStore: setup => setup(store as Immutable<Store>),
    store: store as Immutable<Store>,
  };
};
