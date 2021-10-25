import { Commit, DispatchCommit, DispatchProcess, Process, Section } from '../interfaces';

interface SectionProps<State, ActionNames extends string, ProcessNames extends string> {
  state: State;
  actions?: Record<ActionNames, Commit<State>>;
  processes?: Record<ProcessNames, Process<State, ActionNames, ProcessNames>>;
}

export const createSection = <State, ActionNames extends string, ProcessNames extends string>(
  section: SectionProps<State, ActionNames, ProcessNames>
): Section<State, ActionNames, ProcessNames> => {
  section.actions = section.actions || ({} as Record<ActionNames, Commit<State>>);
  section.processes = section.processes || ({} as Record<ProcessNames, Process<State, ActionNames, ProcessNames>>);

  const commit: DispatchCommit<ActionNames> = <Payload>(name: string, payload: Payload) => {
    if (!section.actions[name]) throw new Error(`No ${name} found`);

    const update: State = section.actions[name](payload, section.state);

    Object.assign(section.state, update);
  };

  const process: DispatchProcess<ProcessNames, State> = <Payload>(name: string, payload: Payload) => {
    const fn: Process<State, ActionNames, ProcessNames> = section.processes[name];
    if (!fn) throw new Error(`No ${name} found`);

    const update: Promise<State> = fn(payload, {
      commit,
      process,
      state: section.state,
    });

    update.then(newState => Object.assign(section.state, newState));

    return update;
  };

  return {
    state: section.state,
    commit,
    process,
  };
};
