import { useState } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { SIZES } from '../data/sizes.js';
import { ZONES } from '../data/zones.js';
import { daysBetween, dayKey, dueLabel, formatDay, formatTimestamp } from '../lib/dates.js';
import { STAGES, growthStage, isOverdue } from '../lib/growth.js';
import { ANIMALS } from './animals/index.js';
import { AnimalSprite } from './animals/AnimalSprite.jsx';
import { Modal } from './ui/Modal.jsx';
import { Icon } from './ui/Icon.jsx';

export function AnimalCard({ taskId, onClose, onEdit, onComplete }) {
  const { state, dispatch } = useZoo();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const def = ANIMALS[task.animal] || ANIMALS.bunny;
  const category = state.categories.find((c) => c.id === task.categoryId);
  const zone = ZONES[category?.zone] || ZONES.savanna;
  const stage = growthStage(task);
  const sleepy = isOverdue(task);
  const done = !!task.completedAt;
  const name = def.name.toLowerCase();

  return (
    <Modal title={task.title} onClose={onClose}>
      <div className={`card card--${zone.id}`}>
        <div className="card-hero" style={{ '--zone': zone.color }}>
          <AnimalSprite animal={task.animal} stage={stage} sleepy={sleepy} size={150} className="idle" />
          <div className="card-tags">
            <span className="tag">
              {STAGES[stage]} {name}
            </span>
            <span className="tag">{SIZES[task.size]?.name} task</span>
            <span className="tag" style={{ background: zone.color, color: zone.ink }}>
              {category?.name || 'Unsorted'} · {zone.name}
            </span>
          </div>
        </div>

        {sleepy && (
          <p className="sleepy-note">
            Your {name} is getting sleepy — this was due {daysBetween(task.dueDate, dayKey())} day
            {daysBetween(task.dueDate, dayKey()) === 1 ? '' : 's'} ago. A little progress will perk it up!
          </p>
        )}

        <dl className="card-facts">
          <div>
            <dt>Due</dt>
            <dd>{task.dueDate ? `${formatDay(task.dueDate, { withWeekday: true })}${done ? '' : ` (${dueLabel(task.dueDate).toLowerCase()})`}` : '—'}</dd>
          </div>
          <div>
            <dt>Hatched</dt>
            <dd>{formatTimestamp(task.createdAt)}</dd>
          </div>
          <div>
            <dt>Completed</dt>
            <dd>{done ? formatTimestamp(task.completedAt) : 'Still growing'}</dd>
          </div>
        </dl>

        {task.notes && <p className="card-notes">{task.notes}</p>}

        {task.subtasks.length > 0 && (
          <ul className="subtasks">
            {task.subtasks.map((s) => (
              <li key={s.id}>
                <label className={s.done ? 'is-done' : ''}>
                  <input
                    type="checkbox"
                    checked={s.done}
                    disabled={done}
                    onChange={() => dispatch({ type: 'TOGGLE_SUBTASK', taskId: task.id, subtaskId: s.id })}
                  />
                  <span className="box">{s.done && <Icon name="check" size={14} />}</span>
                  {s.text}
                </label>
              </li>
            ))}
          </ul>
        )}

        {!done && stage === 2 && <p className="ready-note">All grown up! Complete the task to move it into the zoo.</p>}

        <div className="card-actions">
          {!done ? (
            <button className="btn btn--primary" onClick={() => onComplete(task.id)}>
              <Icon name="check" size={18} /> Complete · +{SIZES[task.size]?.coins}
              <Icon name="coin" size={16} />
            </button>
          ) : (
            <button className="btn btn--ghost" onClick={() => dispatch({ type: 'REOPEN_TASK', id: task.id })}>
              Back to nursery (−{task.coinsAwarded} coins)
            </button>
          )}
          <button className="btn btn--ghost" onClick={() => onEdit(task.id)}>
            Edit
          </button>
          {confirmDelete ? (
            <span className="confirm">
              Release forever?
              <button
                className="btn btn--danger btn--small"
                onClick={() => {
                  dispatch({ type: 'DELETE_TASK', id: task.id });
                  onClose();
                }}
              >
                Delete
              </button>
              <button className="btn btn--small btn--ghost" onClick={() => setConfirmDelete(false)}>
                Keep
              </button>
            </span>
          ) : (
            <button className="icon-btn" aria-label="Delete task" onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
