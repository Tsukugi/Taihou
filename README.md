<h1 align="center">Welcome to Taihou!</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.2.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

#### A small state manager written in Typescript

## Install

```sh
npm i @atsu/taihou
```

## Usage

First of all, there is two concepts to know:

1. Sections: A section is the core of the Store, it has three properties `state`, `actions` and `processes`.

    After you define the state, you can define all possible actions that will commit your new state to the section on `actions`.
    And if you have an async operation, you could define it in `processes`.

2. Immutability: A user would never have to modify the state directly but instead provide your new state to the store to handle it, so a created section will expose `commit` and `process`. These will call the specified `action` or `process` function and update the state accordingly.

    A thing to note here is that we want to provide the new state to the section, so please return a new object with the new state.

```ts
import { createSection } from "@atsu/taihou";

const taihou = createSection({
    state: {
        list: [0], // Default value
    },
    actions: {
        set: (payload, state) => ({ list: [...state.list, ...payload] }),
    },
    processes: {
        setAsync: async (payload, { state, commit, process }) => {
            const newList = await doSomethingAsyncWithPromises(payload);

            return { list: [...state.list, ...newList] };
        },
    },
});
```

After creation you can use the section with:

```ts
taihou.state.list; // value: [ 0 ]

// Update the taihou section synchronously.
// Also TS should infer your defined function names so no mistakes for the name
taihou.actions.commit("set", [1, 2]);

taihou.state.list; // value [ 0, 1, 2 ]

// Update the taihou section asynchronously.
const setAsync: Promise<number[]> = taihou.actions.process("setAsync", [3, 4]);

taihou.state.list; // value [ 0, 1, 2 ] - Value is not updated immediately

setAsync.then((newState) => {
    console.log(newState); // value [ 0, 1, 2, 3, 4 ]
});

// A section also can have watchers
taihou.watch((state) => {
    console.log(state); // This is executed whenever a change is detected (the state was updated)
});
```

## Typescript

After you define your section, it should be possible to have type inference.

```ts
taihou; // Should be of type Section<{ list: number[] }, "set", "setAsync">
taihou.commit("unrelatedName", {}); // Should throw an error as "unrelatedName" is not part of "set"
```

This is nice, and enforces a type safe development, but it can be a bit hard to read if you have a big section.

```ts
const taihou = createSection({
    /* now with more options */
});
```

It has this big type on hover:

```ts
const createSection: <{ id: string; list: number[]; name: string; }, "setList" | "setId" | "setName", "updateList">
    (section: SectionProps<{ id: string; list: number[]; name: string; }, "setList" | "setId" | "setName", "updateList">)
    => Section<{ id: string; list: number[]; name: string; }, "setList" | "setId" | "setName", "updateList">
```

So if you want to play with the types, it is recommended to define your actions and state names on predefined interfaces/enums

```ts
interface TaihouState {
  id: string;
  list: number[];
  name: string;
}

enum Actions {
  setList = "setList"
  setId = "setId"
  setName = "setName"
}

enum Processes {
  updateList = "updateList"
}

const taihou = createSection<TaihouState, Actions, Processes>({/* now with more options */})
```

Now it's really minimalistic and nice!

```ts
const createSection: <TaihouState, Actions, Processes>(
    section: SectionProps<TaihouState, Actions, Processes>,
) => Section<TaihouState, Actions, Processes>;
```

Also, to use them you alredy have a nice type definition to call

```ts
taihou.commit(Actions.setList, [1, 2, 3]);
```

### Store

A store by `createStore` is nothing else than a wrapper for your `sections`, it provides a single `store` object that would be your State manager and also `useStore` that is a wrapper function to use on components (e.g. Vue3's DefineComponent), it is intended to have more features for it in the future.

```js
const { store, useStore } = createStore({
    taihou: createSection({
        /* section definition */
    }),
    azuma: createSection({
        /* section definition */
    }),
    atago: createSection({
        /* section definition */
    }),
});

useStore((store) => {
    // here the store reference is available
});

// In Vue 3
useStore((store) =>
    defineComponent({
        mounted() {
            console.log(store.taihou); // here the store reference is available
        },
    }),
);
```

## Author

👤 **Tsukugi**

-   Github: [@Tsukugi](https://github.com/Tsukugi)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Tsukugi/Taihou/issues).

## Show your support

Give a ⭐️ if this project helped you!

---
