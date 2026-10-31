import { dayKey } from './dates.js';

export const STAGES = ['baby', 'juvenile', 'adult'];

/** 0..1 share of subtasks done. Completed tasks always count as 1. */
export function progress(task) {
  if (task.completedAt) return 1;
  const total = task.subtasks.length;
  if (!total) return 0;
  return task.subtasks.filter((s) => s.done).length / total;
}

/**
 * Growth stage index: 0 baby, 1 juvenile, 2 adult.
 * - finishing a third of the subtasks makes a juvenile
 * - finishing all of them (or completing the task) makes an adult
 */
export function growthStage(task) {
  if (task.completedAt) return 2;
  const p = progress(task);
  if (task.subtasks.length && p >= 1) return 2;
  if (p >= 1 / 3 - 1e-9) return 1;
  return 0;
}

export function isOverdue(task, today = dayKey()) {
  return !task.completedAt && !!task.dueDate && task.dueDate < today;
}
