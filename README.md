<h1 align="center">Welcome to Taihou!</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.2.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

#### A simple state manager written in Typescript

## How to Install

Copy, paste and run, like most packages.

```sh
npm i @atsu/taihou
```

## Usage

There is only one simple thing to learn for Taihou, the `UseStateProps`

```ts
export type UseStateProps<State, Actions, Getters> = {
    state: State; // Initial state you want to track
    actions: Actions; // Set of functions that will update the state
    getters: Getters; // Set of functions that will get data from the state
    options?: TaihouOptions; // Configuration options
};
```

Then you are good to go, this is a basic example on how to use it.

```ts
import { useState } from "@atsu/taihou";

const taihou = useState({
    state: {
        list: [],
        flag: false,
        nested: {
            listenToMe: false,
        },
    },
    actions: {
        // Define how your actions will modify the state, and return a new state object
        addToList: (state, payload) => ({
            ...state,
            list: [...state.list, ...payload],
        }),
        changeFlag: (state, payload) => ({ ...state, flag: payload }),
        toggleListenToMe: (state, payload) => ({
            ...state,
            nested: {
                ...state.nested,
                listenToMe: payload;
            }
        })
    },
    getters: {
        isListenToMe: (state) => state.nested.listenToMe;
    }
});

const onTaihouUpdate = ({ list, flag }) => {
    console.log("I will receive this updated ", list);
    console.log("I will receive this updated flag as", flag);
};

watchTaihou(onTaihouUpdate); // I want to watch for updates

// Get the actions
const { addToList, changeFlag, toggleListenToMe } = taihouState.actions;

addToList(["I want to add this"]); // This will trigger an update
changeFlag(true); // This will trigger an update again
toggleListenToMe(true); // This too


const { isListenToMe } = taihouState.getters;

console.log(isListenToMe()) // Should get the current state of nested.listenToMe

console.log(taihouState.getState()) // I get the whole state object;

unwatchTaihou(onTaihouUpdate); // I am responisble and clean my listeners
```

## Typescript

After you define your state, it should be possible to have type inference.

```ts
taihou.getState(); // Should be of type { list: any[], flag: boolean, nested: { listenToMe: boolean }}
```

This is nice, and enforces a type safe development, but it can be a bit hard to read if you have a big state.

Plus, we have an `any[]` in the list type, TS took the initial values to type it.

We can do it better, so we simply define an `TaihouState` interface to feed the useState generic:

```ts
interface TaihouState {
    list: string[];
    flag: boolean;
    nested: {
        listenToMe: boolean;
    };
}
```

And include it in the `useState` as `useState<TaihouState>`.

Or you can always make your code organized, I prefer it this way:

```ts
const initialTaihouState: TaihouState = {
    list: [],
    flag: false,
    nested: {
        listenToMe: false;
    };
};
const taihou = useState(initialTaihouState);
```

And that's it, really simple!

You can organize multiple states as sections of a store, if you want to separate concerns and also to separate the watchers' event handlers.

```ts
export const MyAppStore = {
    taihou: useState(initialTaihouState);
    azuma: useState(initialAzumaState);
    atago: useState(initialAtagoState);
}
```

```ts
/* In another file */
const { getState, actions, getters, watch, unwatch } = MyAppStore.azuma;
```

### Configuration

If you wanna see what's going on every update, just enable `debug` mode in the options:

```ts
useState({
    // ... rest of the props
    options: { debug: true },
});
```

This way Taihou will log any change update into the console.

## Common questions and answers
Q: I checked the code, we are DeepCloning with JSON parse/stringify!? 

A: Yes, for now. I will change to a faster method whenever i have time.

Q: What happened to the simplicity of 0.4.x?, the `[state, watch, unwatch]` paradigm?

A: That was awesome, but it had a problem with how JS handles objects by reference, making the Proxy to not trigger updates when dynamically adding properties. 

I wanted to make the actions (state mutations) more explicit, although sacrificing a bit of simplicity, we can have more control on every update and be reliable on edits.

Q: This basically describes the `Publish-subscribe pattern`, why not simply use a message system?

A: I do not want to define messages and map them in an Enum. Taihou 0.2.x used this method of doing things.

Q: Why I would use this instead of Redux or Pinia or any other store management?

A: The main point of Taihou is simplicity, it resolves the problem of needing a State and Event management and only that.
This gives you also the benefit of integrating on almost any project (that uses npm).

## Author

👤 **Tsukugi**

-   Github: [@Tsukugi](https://github.com/Tsukugi)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Tsukugi/Taihou/issues).

## Show your support

Give a ⭐️ if this project helped you!

---
