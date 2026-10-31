export const STORAGE_KEY = 'task-zoo:v1';
export const SCHEMA_VERSION = 1;

export function defaultState() {
  return {
    version: SCHEMA_VERSION,
    coins: 0,
    categories: [
      { id: 'cat_work', name: 'Work', zone: 'savanna' },
      { id: 'cat_home', name: 'Home', zone: 'jungle' },
      { id: 'cat_health', name: 'Health', zone: 'arctic' },
      { id: 'cat_fun', name: 'Fun', zone: 'ocean' },
    ],
    tasks: [],
    decorations: [],
    // Day keys of completions whose tasks were deleted, so stats survive.
    pastCompletions: [],
  };
}
