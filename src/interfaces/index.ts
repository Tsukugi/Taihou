export type Commit<State> = (payload: any, options: State) => State;

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
  readonly watch: (onWatch: (state: State) => void) => void;
  readonly state: State;
  readonly commit: DispatchCommit<ActionNames>;
  readonly process: DispatchProcess<ProcessNames, State>;
}
