import { Immutable } from './inmutable';

export type Commit<State> = (payload: any, options: Immutable<State>) => State;

export type Process<State, ActionNames extends string, ProcessNames extends string> = (
  payload: any,
  options: Section<State, ActionNames, ProcessNames>
) => Promise<State>;

export type DispatchCommit<ActionName extends string> = <Payload>(name: ActionName, payload: Payload) => void;
export type DispatchProcess<ProcessName extends string, State> = <Payload>(
  name: ProcessName,
  payload: Payload
) => Promise<State>;

export interface Section<State, ActionNames extends string, ProcessNames extends string> {
  state: Immutable<State>;
  commit: DispatchCommit<ActionNames>;
  process: DispatchProcess<ProcessNames, State>;
}
