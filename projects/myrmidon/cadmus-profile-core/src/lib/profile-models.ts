/**
 * A generic signal used by child components to emit
 * events signaling some action to be taken.
 */
export interface ComponentSignal<T> {
  id: string;
  payload?: T;
}
