import { useEffect, useState } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { growthStage, isOverdue, progress } from '../lib/growth.js';
import { dueLabel } from '../lib/dates.js';
import { AnimalSprite } from './animals/AnimalSprite.jsx';
import { Egg } from './animals/Egg.jsx';
import { NurseryTerrain } from './scenery/Terrain.jsx';
import { Icon } from './ui/Icon.jsx';

const HATCH_WINDOW_MS = 2500;

function NurseryAnimal({ task, onOpen }) {
  const [phase, setPhase] = useState(() =>
    Date.now() - new Date(task.createdAt).getTime() < HATCH_WINDOW_MS ? 'egg' : 'done',
  );

  useEffect(() => {
    if (phase === 'egg') {
      const t = setTimeout(() => setPhase('crack'), 900);
      return () => clearTimeout(t);
    }
    if (phase === 'crack') {
      const t = setTimeout(() => setPhase('done'), 700);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const stage = growthStage(task);
  const sleepy = isOverdue(task);
  const pct = Math.round(progress(task) * 100);
  const ready = stage === 2;

  return (
    <li>
      <button className={`nursling ${sleepy ? 'nursling--sleepy' : ''}`} onClick={() => onOpen(task.id)}>
        <div className="nursling-stage">
          {phase !== 'done' && <Egg cracked={phase === 'crack'} />}
          {phase !== 'egg' && (
            <AnimalSprite
              animal={task.animal}
              stage={stage}
              sleepy={sleepy}
              size={92}
              className={`idle ${phase === 'crack' ? 'hatching' : ''}`}
            />
          )}
          {sleepy && (
            <span className="check-bubble" title="This one is overdue — check on it!">
              !
            </span>
          )}
          {ready && <span className="ready-badge">Ready!</span>}
        </div>
        <span className="nursling-title">{task.title}</span>
        {task.subtasks.length > 0 && (
          <span className="mini-progress" aria-label={`${pct}% of subtasks done`}>
            <span style={{ width: `${pct}%` }} />
          </span>
        )}
        <span className={`due-chip ${sleepy ? 'due-chip--late' : ''}`}>{dueLabel(task.dueDate)}</span>
      </button>
    </li>
  );
}

export function Nursery({ onOpenTask, onAddTask }) {
  const { state } = useZoo();
  const babies = state.tasks
    .filter((t) => !t.completedAt)
    .sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999') || a.createdAt.localeCompare(b.createdAt));

  return (
    <section className="pen nursery" aria-labelledby="nursery-title">
      <NurseryTerrain />
      <div className="pen-head">
        <h2 id="nursery-title">Nursery</h2>
        <span className="pen-count">{babies.length} growing</span>
      </div>
      <ul className="nursery-grid">
        {babies.map((t) => (
          <NurseryAnimal key={t.id} task={t} onOpen={onOpenTask} />
        ))}
        <li>
          <button className="nursling nursling--add" onClick={onAddTask}>
            <div className="nursling-stage">
              <Egg />
              <span className="add-plus">
                <Icon name="plus" size={22} />
              </span>
            </div>
            <span className="nursling-title">New task</span>
            <span className="due-chip">lay an egg</span>
          </button>
        </li>
      </ul>
      {babies.length === 0 && (
        <p className="pen-empty">The nursery is quiet. Add a task to hatch a baby animal!</p>
      )}
    </section>
  );
}
