import { Commit, DispatchCommit, DispatchProcess, Process, Section } from '../interfaces';
import { createSubscriber } from './subscribe';

interface SectionProps<State, ActionNames extends string, ProcessNames extends string> {
  state: State;
  actions?: Record<ActionNames, Commit<State>>;
  processes?: Record<ProcessNames, Process<State, ActionNames, ProcessNames>>;
}

type EventType = 'commit' | 'process' | 'none';

export const createSection = <
  State extends Record<string | symbol | number, any>,
  ActionNames extends string,
  ProcessNames extends string
>(
  section: SectionProps<State, ActionNames, ProcessNames>
): Section<State, ActionNames, ProcessNames> => {
  let eventType: EventType = 'none';
  const events = createSubscriber();

  const state: State = new Proxy<State>(section.state, {
    set: (target, key, value) => {
      if (eventType === 'none') throw Error('Setting State directly is forbidden');
      target[key as keyof State] = value;
      events.publish('stateChange', state);
      eventType = 'none';
      return true;
    },
  });

  section.actions = section.actions || ({} as Record<ActionNames, Commit<State>>);
  section.processes = section.processes || ({} as Record<ProcessNames, Process<State, ActionNames, ProcessNames>>);

  const commit: DispatchCommit<ActionNames> = <Payload>(name: string, payload: Payload) => {
    if (!section.actions[name]) throw new Error(`No ${name} found`);

    const update: State = section.actions[name](payload, state);
    eventType = 'commit';
    Object.assign(state, update);
  };

  const process: DispatchProcess<ProcessNames, State> = <Payload>(name: string, payload: Payload) => {
    const fn: Process<State, ActionNames, ProcessNames> = section.processes[name];
    if (!fn) throw new Error(`No ${name} found`);

    const update: Promise<State> = fn(payload, {
      commit,
      process,
      state: state,
      watch,
    });

    update.then(newState => {
      eventType = 'process';
      return Object.assign(state, newState);
    });

    return update;
  };

  const watch = <T>(onWatch: (state: State) => T) => events.subscribe('stateChange', () => onWatch(state));

  return {
    state,
    watch,
    commit,
    process,
  };
};
