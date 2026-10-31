import { useEffect, useRef, useState } from 'react';
import { AnimalSprite } from './animals/AnimalSprite.jsx';
import { SIZES } from '../data/sizes.js';

const BASE_SIZE = 70;
// Feet stay within this box (percent of the habitat).
const AREA = { x0: 13, x1: 87, y0: 50, y1: 94 };

const rand = (a, b) => a + Math.random() * (b - a);
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** A completed animal that strolls around its habitat on its own. */
export function Wanderer({ task, onOpen, disabled }) {
  const [pos, setPos] = useState(() => ({ x: rand(AREA.x0, AREA.x1), y: rand(AREA.y0, AREA.y1) }));
  const [move, setMove] = useState({ ms: 0, walking: false, flip: Math.random() < 0.5 });
  const posRef = useRef(pos);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    let timer;
    const idle = () => {
      timer = setTimeout(walk, rand(1800, 5200));
    };
    const walk = () => {
      const p = posRef.current;
      const next = {
        x: Math.min(AREA.x1, Math.max(AREA.x0, p.x + rand(-30, 30))),
        y: Math.min(AREA.y1, Math.max(AREA.y0, p.y + rand(-16, 16))),
      };
      const ms = Math.max(900, Math.hypot(next.x - p.x, next.y - p.y) * 110);
      posRef.current = next;
      setPos(next);
      setMove({ ms, walking: true, flip: next.x < p.x });
      timer = setTimeout(() => {
        setMove((m) => ({ ...m, walking: false }));
        idle();
      }, ms);
    };
    idle();
    return () => clearTimeout(timer);
  }, []);

  const size = BASE_SIZE * (SIZES[task.size]?.scale || 1);

  return (
    <button
      className={`wanderer ${move.walking ? 'is-walking' : ''}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        zIndex: Math.round(pos.y),
        transitionDuration: `${move.ms}ms`,
        pointerEvents: disabled ? 'none' : undefined,
      }}
      onClick={() => onOpen(task.id)}
      aria-label={`${task.title} — open card`}
    >
      <div className={`wanderer-flip ${move.flip ? 'is-flipped' : ''}`}>
        <AnimalSprite animal={task.animal} stage={2} size={size} className="idle" />
      </div>
    </button>
  );
}
