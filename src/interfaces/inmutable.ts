// See this https://github.com/Microsoft/TypeScript/issues/13923#issuecomment-653675557
export type Immutable<T> = T extends Function | boolean | number | string | null | undefined
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<Immutable<U>>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<Immutable<K>, Immutable<V>>
  : T extends Set<infer S>
  ? ReadonlySet<Immutable<S>>
  : { readonly [P in keyof T]: Immutable<T[P]> };
