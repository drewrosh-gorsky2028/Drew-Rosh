import { SIZES } from '../data/sizes.js';
import { DECORATIONS } from '../data/decorations.js';
import { dayKey } from '../lib/dates.js';
import { uid } from '../lib/id.js';

const mapTask = (state, id, fn) => ({
  ...state,
  tasks: state.tasks.map((t) => (t.id === id ? fn(t) : t)),
});

export function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const task = {
        id: action.id || uid('task'),
        title: action.task.title,
        notes: action.task.notes || '',
        size: action.task.size,
        animal: action.task.animal,
        categoryId: action.task.categoryId,
        dueDate: action.task.dueDate || null,
        subtasks: action.task.subtasks || [],
        createdAt: action.now || new Date().toISOString(),
        completedAt: null,
        coinsAwarded: 0,
      };
      return { ...state, tasks: [...state.tasks, task] };
    }

    case 'UPDATE_TASK':
      return mapTask(state, action.id, (t) => ({ ...t, ...action.changes }));

    case 'DELETE_TASK': {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task) return state;
      const past = task.completedAt
        ? [...state.pastCompletions, dayKey(new Date(task.completedAt))]
        : state.pastCompletions;
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id), pastCompletions: past };
    }

    case 'TOGGLE_SUBTASK':
      return mapTask(state, action.taskId, (t) => ({
        ...t,
        subtasks: t.subtasks.map((s) => (s.id === action.subtaskId ? { ...s, done: !s.done } : s)),
      }));

    case 'COMPLETE_TASK': {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task || task.completedAt) return state;
      const coins = SIZES[task.size]?.coins ?? 10;
      const next = mapTask(state, action.id, (t) => ({
        ...t,
        completedAt: action.now || new Date().toISOString(),
        subtasks: t.subtasks.map((s) => ({ ...s, done: true })),
        coinsAwarded: coins,
      }));
      return { ...next, coins: state.coins + coins };
    }

    case 'REOPEN_TASK': {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task || !task.completedAt) return state;
      const next = mapTask(state, action.id, (t) => ({ ...t, completedAt: null, coinsAwarded: 0 }));
      return { ...next, coins: Math.max(0, state.coins - (task.coinsAwarded || 0)) };
    }

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, { id: action.id || uid('cat'), name: action.name, zone: action.zone }],
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.id ? { ...c, ...action.changes } : c)),
      };

    case 'DELETE_CATEGORY': {
      if (state.categories.length <= 1) return state;
      const remaining = state.categories.filter((c) => c.id !== action.id);
      const fallback = action.moveTo || remaining[0].id;
      return {
        ...state,
        categories: remaining,
        tasks: state.tasks.map((t) => (t.categoryId === action.id ? { ...t, categoryId: fallback } : t)),
        decorations: state.decorations.map((d) =>
          d.habitatId === action.id ? { ...d, habitatId: null } : d,
        ),
      };
    }

    case 'BUY_DECOR': {
      const item = DECORATIONS[action.kind];
      if (!item || state.coins < item.price) return state;
      return {
        ...state,
        coins: state.coins - item.price,
        decorations: [...state.decorations, { id: action.id || uid('decor'), kind: item.id, habitatId: null, x: 50, y: 70 }],
      };
    }

    case 'PLACE_DECOR':
      return {
        ...state,
        decorations: state.decorations.map((d) =>
          d.id === action.id ? { ...d, habitatId: action.habitatId, x: action.x, y: action.y } : d,
        ),
      };

    case 'STORE_DECOR':
      return {
        ...state,
        decorations: state.decorations.map((d) => (d.id === action.id ? { ...d, habitatId: null } : d)),
      };

    case 'SELL_DECOR': {
      const decor = state.decorations.find((d) => d.id === action.id);
      if (!decor) return state;
      const refund = Math.floor((DECORATIONS[decor.kind]?.price || 0) / 2);
      return {
        ...state,
        coins: state.coins + refund,
        decorations: state.decorations.filter((d) => d.id !== action.id),
      };
    }

    case 'REPLACE_STATE':
      return action.state;

    default:
      return state;
  }
}
