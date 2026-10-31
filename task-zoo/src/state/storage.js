import { SCHEMA_VERSION, STORAGE_KEY, defaultState } from './defaults.js';

/** Bring older or partial saves up to the current shape. */
export function migrate(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object') return base;
  const state = { ...base, ...raw, version: SCHEMA_VERSION };
  if (!Array.isArray(state.categories) || !state.categories.length) state.categories = base.categories;
  if (!Array.isArray(state.tasks)) state.tasks = [];
  if (!Array.isArray(state.decorations)) state.decorations = [];
  if (!Array.isArray(state.pastCompletions)) state.pastCompletions = [];
  state.tasks = state.tasks.map((t) => ({ notes: '', subtasks: [], dueDate: null, completedAt: null, ...t }));
  state.coins = Number.isFinite(state.coins) ? state.coins : 0;
  return state;
}

export function loadState() {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    return migrate(text ? JSON.parse(text) : null);
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled (e.g. private mode) — the app still works for this visit.
  }
}
