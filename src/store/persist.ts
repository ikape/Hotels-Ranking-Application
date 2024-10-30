// store/persist.ts
export const saveToLocalStorage = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (e) {
    console.warn('Could not save state', e);
  }
};

export const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Could not load state', e);
    return undefined;
  }
};
