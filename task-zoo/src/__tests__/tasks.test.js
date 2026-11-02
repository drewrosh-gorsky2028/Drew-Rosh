import { describe, expect, it } from 'vitest';
import { newTask, removeTask, toggleDone } from '../lib/tasks.js';

describe('tasks', () => {
  it('creates a task with a trimmed title', () => {
    const t = newTask('  Water plants  ');
    expect(t.title).toBe('Water plants');
    expect(t.completedAt).toBeNull();
  });

  it('toggles done and back', () => {
    const t = newTask('A');
    const done = toggleDone([t], t.id);
    expect(done[0].completedAt).toBeTruthy();
    expect(toggleDone(done, t.id)[0].completedAt).toBeNull();
  });

  it('removes a task', () => {
    const a = newTask('A');
    const b = newTask('B');
    expect(removeTask([a, b], a.id)).toEqual([b]);
  });
});
