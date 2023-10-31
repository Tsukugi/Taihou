import { SubscribeAction } from "../interfaces";

type Update<T> = (update: T) => void;
export interface CreateSubscriberProps<T> {
    subscribe: SubscribeAction<T>;
    unsubscribe: SubscribeAction<T>;
    publish: Update<T>;
}

export const createSubscriber = <T>(): CreateSubscriberProps<T> => {
    const subscribers: Set<Update<T>> = new Set();

    return {
        subscribe(cb) {
            subscribers.add(cb);
            return cb;
        },

        unsubscribe(cb) {
            subscribers.delete(cb);
            return cb;
        },

        publish(update) {
            subscribers.forEach((cb) => cb(update));
        },
    };
};
