import {useCallback, useState} from "react";

export function useSet<T>(initialState: T[]): [
  getAll: () => T[],
  has: (item: T) => boolean,
  toggle: (item: T) => void,
  clear: () => void
] {
  const [state, setState] = useState<Set<T>>(new Set(initialState));

  const toggle = useCallback((item: T) => {
    setState(prev => {
      const newState = new Set(prev);
      if (newState.has(item)) {
        newState.delete(item);
      } else {
        newState.add(item);
      }
      return newState;
    });
  }, [setState]);

  const has = useCallback((item: T) => {
    return state.has(item);
  }, [state]);

  const clear = useCallback(() => {
    setState(new Set());
  }, [setState]);

  const getAll = useCallback(() => {
    return Array.from(state);
  }, [state]);

  return [getAll, has, toggle, clear];
}