import { uid } from './id.js';

// Kept from the earlier name so lists saved before the rename still load.
export const STORAGE_KEY = 'to-zoo-list:v1';

export const LISTS = [
  { id: 'day', name: 'Today' },
  { id: 'week', name: 'This week' },
  { id: 'long', name: 'Long term' },
];

export function newTask(title, list = 'day') {
  return {
    id: uid('task'),
    title: title.trim(),
    list,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

export function toggleDone(tasks, id) {
  return tasks.map((t) =>
    t.id === id ? { ...t, completedAt: t.completedAt ? null : new Date().toISOString() } : t,
  );
}

export function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

export function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved?.tasks)) return [];
    // Tasks saved before there were separate lists go into Today.
    return saved.tasks.map((t) => ({ list: 'day', ...t }));
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks }));
  } catch {
    // Storage is full or blocked; the list still works for this visit.
  }
}
