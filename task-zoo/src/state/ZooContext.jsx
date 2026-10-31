import { createContext, useContext, useEffect, useReducer } from 'react';
import { reducer } from './reducer.js';
import { loadState, saveState } from './storage.js';

const ZooContext = createContext(null);

export function ZooProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <ZooContext.Provider value={{ state, dispatch }}>{children}</ZooContext.Provider>;
}

export function useZoo() {
  const ctx = useContext(ZooContext);
  if (!ctx) throw new Error('useZoo must be used inside <ZooProvider>');
  return ctx;
}
