import { SubscribeAction } from "../interfaces";

export interface CreateSubscriberProps<T> {
    subscribe: SubscribeAction<T>;
    unsubscribe: SubscribeAction<T>;
    publish: (message: T) => void;
}

export const createSubscriber = <T>(): CreateSubscriberProps<T> => {
    const subscribers: Set<(message: T) => void> = new Set();

    return {
        subscribe(cb) {
            subscribers.add(cb);
        },

        unsubscribe(cb) {
            subscribers.delete(cb);
        },

        publish(message) {
            subscribers.forEach((cb) => cb(message));
        },
    };
};
