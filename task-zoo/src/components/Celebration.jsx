import { useEffect, useMemo } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { ZONES } from '../data/zones.js';
import { ANIMALS } from './animals/index.js';
import { AnimalSprite } from './animals/AnimalSprite.jsx';
import { Icon } from './ui/Icon.jsx';

const COLORS = ['#ff8fb1', '#ffd56b', '#7fd3b4', '#7fcdf0', '#ff9f5a', '#b9a3ff'];

export function Celebration({ taskId, onClose, onVisit }) {
  const { state } = useZoo();
  const task = state.tasks.find((t) => t.id === taskId);
  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.8 + Math.random() * 1.4,
        rot: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        round: Math.random() < 0.4,
      })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(onClose, 6500);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!task) return null;
  const category = state.categories.find((c) => c.id === task.categoryId);
  const zone = ZONES[category?.zone] || ZONES.savanna;
  const animal = ANIMALS[task.animal]?.name || 'animal';

  return (
    <div className="celebrate" role="alertdialog" aria-label="Task complete" onClick={onClose}>
      <div className="confetti" aria-hidden="true">
        {confetti.map((c, i) => (
          <i
            key={i}
            style={{
              left: `${c.left}%`,
              background: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.dur}s`,
              borderRadius: c.round ? '50%' : '2px',
              '--rot': `${c.rot}deg`,
            }}
          />
        ))}
      </div>
      <div className="celebrate-card" onClick={(e) => e.stopPropagation()}>
        <div className="celebrate-burst" style={{ '--zone': zone.color }}>
          <AnimalSprite animal={task.animal} stage={2} size={170} className="hop" />
        </div>
        <h2>Hooray!</h2>
        <p>
          <strong>{task.title}</strong> is done.
          <br />
          Your {animal.toLowerCase()} is moving into the <strong>{category?.name}</strong> habitat ({zone.name}).
        </p>
        <p className="celebrate-coins">
          +{task.coinsAwarded} <Icon name="coin" size={22} />
        </p>
        <div className="celebrate-actions">
          <button className="btn btn--ghost" onClick={onClose}>
            Yay!
          </button>
          <button className="btn btn--primary" onClick={onVisit}>
            <Icon name="zoo" size={18} /> Visit the zoo
          </button>
        </div>
      </div>
    </div>
  );
}
