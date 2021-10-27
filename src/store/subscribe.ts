type Callback<Data> = (data: Data) => void;

export const createSubscriber = <Events extends string, Data extends Record<string, any>>() => {
  const events = {} as Record<Events, Callback<Data>[]>;

  const subscribe = (event: Events, callback: Callback<Data>): void => {
    if (events.hasOwnProperty(event)) {
      events[event].push(callback);
    } else {
      events[event] = [];
    }
  };
  const publish = (event: Events, data = {} as Data) => {
    if (!events.hasOwnProperty(event)) {
      return [];
    }
    return events[event].map(callback => callback(data));
  };

  return { subscribe, publish };
};
