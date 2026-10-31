import { useState } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { ZONES } from '../data/zones.js';
import { dayKey, dueLabel, formatTimestamp } from '../lib/dates.js';
import { growthStage, isOverdue, progress } from '../lib/growth.js';
import { AnimalSprite } from './animals/AnimalSprite.jsx';
import { Icon } from './ui/Icon.jsx';

function groupOf(task, today) {
  if (task.completedAt) return 'done';
  if (!task.dueDate) return 'someday';
  if (task.dueDate < today) return 'overdue';
  if (task.dueDate === today) return 'today';
  return 'upcoming';
}

const GROUPS = [
  { id: 'overdue', title: 'Needs a check-in' },
  { id: 'today', title: 'Today' },
  { id: 'upcoming', title: 'Upcoming' },
  { id: 'someday', title: 'No due date' },
  { id: 'done', title: 'Living in the zoo' },
];

function Row({ task, category, onOpen, onComplete }) {
  const zone = ZONES[category?.zone] || ZONES.savanna;
  const done = !!task.completedAt;
  const doneCount = task.subtasks.filter((s) => s.done).length;
  return (
    <li className={`task-row ${done ? 'task-row--done' : ''} ${isOverdue(task) ? 'task-row--late' : ''}`}>
      <button
        className={`check ${done ? 'is-checked' : ''}`}
        onClick={() => !done && onComplete(task.id)}
        aria-label={done ? 'Completed' : `Complete “${task.title}”`}
        disabled={done}
      >
        {done && <Icon name="check" size={16} />}
      </button>
      <button className="task-row-main" onClick={() => onOpen(task.id)}>
        <AnimalSprite animal={task.animal} stage={growthStage(task)} sleepy={isOverdue(task)} size={40} />
        <span className="task-row-text">
          <span className="task-row-title">{task.title}</span>
          <span className="task-row-meta">
            <span className="cat-dot" style={{ background: zone.color }} />
            {category?.name || 'Unsorted'}
            {task.subtasks.length > 0 && (
              <span>
                · {doneCount}/{task.subtasks.length}
              </span>
            )}
            <span>· {done ? `Done ${formatTimestamp(task.completedAt)}` : dueLabel(task.dueDate)}</span>
          </span>
          {!done && task.subtasks.length > 0 && (
            <span className="mini-progress">
              <span style={{ width: `${Math.round(progress(task) * 100)}%` }} />
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

export function TaskList({ onOpenTask, onComplete, onAddTask }) {
  const { state } = useZoo();
  const [filter, setFilter] = useState('all');
  const [showDone, setShowDone] = useState(false);
  const today = dayKey();
  const cats = Object.fromEntries(state.categories.map((c) => [c.id, c]));

  const tasks = state.tasks
    .filter((t) => filter === 'all' || t.categoryId === filter)
    .sort((a, b) => {
      if (a.completedAt && b.completedAt) return b.completedAt.localeCompare(a.completedAt);
      return (a.dueDate || '9999').localeCompare(b.dueDate || '9999') || a.createdAt.localeCompare(b.createdAt);
    });

  const grouped = GROUPS.map((g) => ({ ...g, tasks: tasks.filter((t) => groupOf(t, today) === g.id) }));
  const openCount = tasks.filter((t) => !t.completedAt).length;

  return (
    <section className="task-list" aria-labelledby="list-title">
      <div className="section-head">
        <h2 id="list-title">All tasks</h2>
        <button className="btn btn--primary btn--small" onClick={onAddTask}>
          <Icon name="plus" size={16} /> Add
        </button>
      </div>
      <div className="chips" role="group" aria-label="Filter by category">
        <button className={`chip ${filter === 'all' ? 'is-active' : ''}`} onClick={() => setFilter('all')}>
          All
        </button>
        {state.categories.map((c) => (
          <button key={c.id} className={`chip ${filter === c.id ? 'is-active' : ''}`} onClick={() => setFilter(c.id)}>
            <span className="cat-dot" style={{ background: ZONES[c.zone]?.color }} />
            {c.name}
          </button>
        ))}
      </div>

      {openCount === 0 && <p className="muted">Nothing due. Your animals are happy!</p>}

      {grouped.map((g) => {
        if (!g.tasks.length) return null;
        const collapsed = g.id === 'done' && !showDone;
        return (
          <div key={g.id} className={`task-group task-group--${g.id}`}>
            <h3>
              {g.id === 'done' ? (
                <button className="link-btn" onClick={() => setShowDone((v) => !v)} aria-expanded={showDone}>
                  {g.title} ({g.tasks.length}) {showDone ? '▾' : '▸'}
                </button>
              ) : (
                <>
                  {g.title} <span className="muted">({g.tasks.length})</span>
                </>
              )}
            </h3>
            {!collapsed && (
              <ul>
                {g.tasks.map((t) => (
                  <Row key={t.id} task={t} category={cats[t.categoryId]} onOpen={onOpenTask} onComplete={onComplete} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}
