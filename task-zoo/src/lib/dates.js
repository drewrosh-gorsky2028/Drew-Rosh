// All "day" logic uses local-time YYYY-MM-DD keys so streaks and due dates
// match the calendar on the user's device.

export function dayKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDayKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = parseDayKey(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}

/** Whole days from `fromKey` to `toKey` (positive if toKey is later). */
export function daysBetween(fromKey, toKey) {
  const ms = parseDayKey(toKey) - parseDayKey(fromKey);
  return Math.round(ms / 86400000);
}

/** Monday of the week containing `key`. */
export function startOfWeek(key) {
  const d = parseDayKey(key);
  const dow = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
  d.setDate(d.getDate() - dow);
  return dayKey(d);
}

export function formatDay(key, { withWeekday = false } = {}) {
  if (!key) return '';
  const opts = { month: 'short', day: 'numeric' };
  if (withWeekday) opts.weekday = 'short';
  const d = parseDayKey(key);
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString(undefined, opts);
}

export function formatTimestamp(iso) {
  if (!iso) return '';
  return formatDay(dayKey(new Date(iso)), { withWeekday: true });
}

/** Friendly relative label for a due date. */
export function dueLabel(dueKey, today = dayKey()) {
  if (!dueKey) return 'No due date';
  const diff = daysBetween(today, dueKey);
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff === -1) return 'Overdue by 1 day';
  if (diff < 0) return `Overdue by ${-diff} days`;
  if (diff < 7) return `Due ${formatDay(dueKey, { withWeekday: true })}`;
  return `Due ${formatDay(dueKey)}`;
}
