import { describe, expect, it } from 'vitest';
import { reducer } from '../state/reducer.js';
import { defaultState } from '../state/defaults.js';
import { migrate } from '../state/storage.js';
import { growthStage, isOverdue } from '../lib/growth.js';
import { doneThisWeek, streak } from '../lib/stats.js';
import { addDays } from '../lib/dates.js';

const sub = (n, done) => Array.from({ length: n }, (_, i) => ({ id: `s${i}`, text: `s${i}`, done: i < done }));
const task = (over = {}) => ({ id: 't', title: 'T', size: 'medium', animal: 'panda', categoryId: 'cat_work', dueDate: null, subtasks: [], createdAt: '2026-10-01T10:00:00Z', completedAt: null, ...over });

describe('growth', () => {
  it('grows through baby → juvenile → adult with subtasks', () => {
    expect(growthStage(task({ subtasks: sub(3, 0) }))).toBe(0);
    expect(growthStage(task({ subtasks: sub(3, 1) }))).toBe(1);
    expect(growthStage(task({ subtasks: sub(3, 2) }))).toBe(1);
    expect(growthStage(task({ subtasks: sub(3, 3) }))).toBe(2);
  });
  it('completed tasks are always adults', () => {
    expect(growthStage(task({ completedAt: '2026-10-02T00:00:00Z' }))).toBe(2);
  });
  it('flags overdue open tasks only', () => {
    expect(isOverdue(task({ dueDate: '2026-10-01' }), '2026-10-02')).toBe(true);
    expect(isOverdue(task({ dueDate: '2026-10-02' }), '2026-10-02')).toBe(false);
    expect(isOverdue(task({ dueDate: '2026-10-01', completedAt: 'x' }), '2026-10-02')).toBe(false);
  });
});

describe('reducer', () => {
  it('awards coins on completion and refunds on reopen', () => {
    let s = reducer(defaultState(), { type: 'ADD_TASK', id: 'a', task: task({ size: 'large' }) });
    s = reducer(s, { type: 'COMPLETE_TASK', id: 'a' });
    expect(s.coins).toBe(50);
    expect(s.tasks[0].completedAt).toBeTruthy();
    s = reducer(s, { type: 'COMPLETE_TASK', id: 'a' });
    expect(s.coins).toBe(50); // no double reward
    s = reducer(s, { type: 'REOPEN_TASK', id: 'a' });
    expect(s.coins).toBe(0);
  });
  it('buys decorations only when affordable', () => {
    let s = { ...defaultState(), coins: 25 };
    s = reducer(s, { type: 'BUY_DECOR', kind: 'tree' });
    expect(s.decorations).toHaveLength(0);
    s = reducer(s, { type: 'BUY_DECOR', kind: 'rock', id: 'r' });
    expect(s.coins).toBe(5);
    s = reducer(s, { type: 'PLACE_DECOR', id: 'r', habitatId: 'cat_home', x: 10, y: 80 });
    expect(s.decorations[0]).toMatchObject({ habitatId: 'cat_home', x: 10, y: 80 });
  });
  it('moves tasks when a category is deleted', () => {
    let s = reducer(defaultState(), { type: 'ADD_TASK', id: 'a', task: task({ categoryId: 'cat_fun' }) });
    s = reducer(s, { type: 'DELETE_CATEGORY', id: 'cat_fun' });
    expect(s.categories.find((c) => c.id === 'cat_fun')).toBeUndefined();
    expect(s.tasks[0].categoryId).toBe('cat_work');
  });
  it('keeps stats history when a completed task is deleted', () => {
    let s = reducer(defaultState(), { type: 'ADD_TASK', id: 'a', task: task() });
    s = reducer(s, { type: 'COMPLETE_TASK', id: 'a', now: new Date(2026, 9, 30, 12).toISOString() });
    s = reducer(s, { type: 'DELETE_TASK', id: 'a' });
    expect(s.pastCompletions).toEqual(['2026-10-30']);
  });
});

describe('stats', () => {
  const at = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d, 12).toISOString();
  };
  it('counts a streak of consecutive days', () => {
    const today = '2026-10-31';
    const state = {
      tasks: [0, 1, 2, 4].map((n, i) => task({ id: `t${i}`, completedAt: at(addDays(today, -n)) })),
      pastCompletions: [],
    };
    expect(streak(state, today)).toBe(3);
    // Nothing done yet today: the streak from yesterday still counts.
    expect(streak(state, addDays(today, 1))).toBe(3);
    expect(streak(state, addDays(today, 2))).toBe(0);
  });
  it('counts completions since Monday', () => {
    const state = { tasks: [task({ completedAt: at('2026-10-26') }), task({ completedAt: at('2026-10-25') })], pastCompletions: ['2026-10-27'] };
    expect(doneThisWeek(state, '2026-10-31')).toBe(2);
  });
});

describe('storage', () => {
  it('repairs missing or broken data', () => {
    expect(migrate(null).categories).toHaveLength(4);
    const s = migrate({ tasks: [{ id: 'x', title: 'x' }], coins: 'lots' });
    expect(s.coins).toBe(0);
    expect(s.tasks[0].subtasks).toEqual([]);
  });
});
