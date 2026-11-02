import { ANIMAL_LIST } from '../components/animals/index.js';
import { pick, uid } from './id.js';

export const STORAGE_KEY = 'to-zoo-list:v1';

export function newTask(title) {
  return {
    id: uid('task'),
    title: title.trim(),
    animal: pick(ANIMAL_LIST).id,
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
    return Array.isArray(saved?.tasks) ? saved.tasks : [];
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
