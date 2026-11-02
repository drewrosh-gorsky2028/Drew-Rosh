import { useEffect, useRef, useState } from 'react';
import { ANIMALS } from './index.js';

const STAGE_SCALE = [0.62, 0.82, 1];

/** Draws a registered animal at a growth stage, with a little pop when it grows. */
export function AnimalSprite({ animal, stage = 0, size = 80 }) {
  const def = ANIMALS[animal] || ANIMALS.bunny;
  const Draw = def.Draw;
  const prev = useRef(stage);
  const [growing, setGrowing] = useState(false);

  useEffect(() => {
    if (stage > prev.current) {
      setGrowing(true);
      const t = setTimeout(() => setGrowing(false), 800);
      prev.current = stage;
      return () => clearTimeout(t);
    }
    prev.current = stage;
  }, [stage]);

  return (
    <div
      className={`sprite ${growing ? 'sprite--growing' : ''}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${stage === 2 ? 'Grown-up' : 'Baby'} ${def.name.toLowerCase()}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="sprite-svg"
        overflow="visible"
        style={{ transform: `scale(${STAGE_SCALE[stage]})` }}
      >
        <Draw stage={stage} />
      </svg>
    </div>
  );
}
