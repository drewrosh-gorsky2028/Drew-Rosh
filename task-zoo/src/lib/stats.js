import { addDays, dayKey, startOfWeek } from './dates.js';

/** Every completion day we know about, including deleted tasks' history. */
export function completionDays(state) {
  const days = state.tasks.filter((t) => t.completedAt).map((t) => dayKey(new Date(t.completedAt)));
  return days.concat(state.pastCompletions || []);
}

export function doneThisWeek(state, today = dayKey()) {
  const monday = startOfWeek(today);
  return completionDays(state).filter((d) => d >= monday && d <= today).length;
}

/**
 * Consecutive days with at least one completed task.
 * The streak stays alive through today even if nothing is done yet today.
 */
export function streak(state, today = dayKey()) {
  const days = new Set(completionDays(state));
  let cursor = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function animalsCollected(state) {
  return state.tasks.filter((t) => t.completedAt).length;
}

export function speciesCollected(state) {
  return new Set(state.tasks.filter((t) => t.completedAt).map((t) => t.animal)).size;
}
