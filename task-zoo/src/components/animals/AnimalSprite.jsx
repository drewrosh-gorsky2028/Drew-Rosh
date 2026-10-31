import { useEffect, useRef, useState } from 'react';
import { ANIMALS } from './index.js';

const STAGE_SCALE = [0.62, 0.82, 1];

/**
 * Renders any registered animal at a growth stage.
 * Plays a "grow" pop + sparkles whenever the stage increases.
 */
export function AnimalSprite({ animal, stage = 0, sleepy = false, size = 80, className = '', title }) {
  const def = ANIMALS[animal] || ANIMALS.bunny;
  const Draw = def.Draw;
  const prev = useRef(stage);
  const [growing, setGrowing] = useState(false);

  useEffect(() => {
    if (stage > prev.current) {
      setGrowing(true);
      const t = setTimeout(() => setGrowing(false), 1000);
      prev.current = stage;
      return () => clearTimeout(t);
    }
    prev.current = stage;
  }, [stage]);

  return (
    <div
      className={`sprite ${sleepy ? 'sprite--sleepy' : ''} ${growing ? 'sprite--growing' : ''} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={title || `${def.name} (${['baby', 'juvenile', 'adult'][stage]})`}
    >
      <div className="sprite-body" style={{ transform: `scale(${STAGE_SCALE[stage]})` }}>
        <svg viewBox="0 0 120 120" className="sprite-svg" overflow="visible">
          <ellipse cx="60" cy="114" rx="34" ry="5" fill="rgba(70,40,20,.15)" />
          <Draw stage={stage} sleepy={sleepy} />
        </svg>
      </div>
      {sleepy && (
        <div className="zzz" aria-hidden="true">
          <span>z</span>
          <span>z</span>
          <span>Z</span>
        </div>
      )}
      {growing && (
        <div className="sparkles" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <i key={i} style={{ '--a': `${i * 45}deg` }} />
          ))}
        </div>
      )}
    </div>
  );
}
