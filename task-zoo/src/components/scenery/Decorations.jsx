import { INK, line } from '../animals/parts.jsx';

// Decoration art. Each piece is drawn in a 100-wide box sitting on its
// baseline (bottom edge). Add a new piece here and in data/decorations.js.

const ART = {
  flowers: {
    h: 60,
    draw: () => (
      <g>
        <path d="M30 58 Q32 40 30 30 M50 58 V24 M70 58 Q68 42 72 32" fill="none" stroke="#5f9e4a" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="40" cy="48" rx="6" ry="3" fill="#7cc46a" transform="rotate(-30 40 48)" />
        {[
          [30, 28, '#ff8fb1'],
          [50, 20, '#ffd56b'],
          [72, 30, '#b9a3ff'],
        ].map(([x, y, c]) => (
          <g key={x}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 6} cy={y + Math.sin((a * Math.PI) / 180) * 6} r="5" fill={c} stroke={INK} strokeWidth="1.6" />
            ))}
            <circle cx={x} cy={y} r="3.6" fill="#fff4c4" stroke={INK} strokeWidth="1.6" />
          </g>
        ))}
      </g>
    ),
  },
  path: {
    h: 30,
    draw: () => (
      <g fill="#e9dcc8" {...line} strokeWidth="2.4">
        <ellipse cx="14" cy="18" rx="12" ry="7" />
        <ellipse cx="40" cy="14" rx="13" ry="8" />
        <ellipse cx="66" cy="19" rx="12" ry="7" />
        <ellipse cx="88" cy="14" rx="10" ry="6.5" />
      </g>
    ),
  },
  rock: {
    h: 60,
    draw: () => (
      <g>
        <path d="M10 58 Q6 30 30 22 Q46 8 66 18 Q92 24 90 58Z" fill="#b8b2c4" {...line} />
        <path d="M28 32 Q40 24 52 28" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" />
        <path d="M60 58 Q68 40 84 44" fill="none" stroke="#9790a6" strokeWidth="2.4" />
        <ellipse cx="22" cy="54" rx="8" ry="3.5" fill="#8fd17a" />
      </g>
    ),
  },
  fence: {
    h: 50,
    draw: () => (
      <g fill="#fff1dc" {...line} strokeWidth="2.4">
        <rect x="4" y="22" width="92" height="7" rx="3" />
        <rect x="4" y="36" width="92" height="7" rx="3" />
        {[8, 30, 52, 74].map((x) => (
          <path key={x} d={`M${x} 48 V12 l9 -8 l9 8 V48Z`} />
        ))}
      </g>
    ),
  },
  bench: {
    h: 56,
    draw: () => (
      <g {...line} strokeWidth="2.4">
        <rect x="14" y="36" width="6" height="18" fill="#7a5a44" />
        <rect x="80" y="36" width="6" height="18" fill="#7a5a44" />
        <rect x="6" y="30" width="88" height="9" rx="3" fill="#e0a26a" />
        <rect x="8" y="8" width="84" height="8" rx="3" fill="#e0a26a" />
        <rect x="8" y="19" width="84" height="7" rx="3" fill="#e0a26a" />
        <path d="M16 16 v14 M84 16 v14" />
      </g>
    ),
  },
  tree: {
    h: 110,
    draw: () => (
      <g>
        <path d="M44 108 Q46 80 40 60 L60 60 Q54 80 58 108Z" fill="#a8775b" {...line} />
        <path d="M50 76 l-10 -8" {...line} />
        <circle cx="34" cy="46" r="22" fill="#79c267" {...line} />
        <circle cx="66" cy="46" r="22" fill="#79c267" {...line} />
        <circle cx="50" cy="28" r="24" fill="#8bd176" {...line} />
        <circle cx="42" cy="22" r="6" fill="#a8e08f" />
        <g fill="#ff7b7b" stroke={INK} strokeWidth="1.5">
          <circle cx="30" cy="48" r="4" /><circle cx="64" cy="36" r="4" /><circle cx="56" cy="56" r="4" />
        </g>
      </g>
    ),
  },
  pond: {
    h: 46,
    draw: () => (
      <g>
        <ellipse cx="50" cy="26" rx="47" ry="18" fill="#cfc6b6" {...line} />
        <ellipse cx="50" cy="25" rx="40" ry="13" fill="#7fcdf0" />
        <path d="M24 24 q8 -4 16 0 M58 30 q6 -3 12 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="70" cy="20" rx="7" ry="3.5" fill="#79c267" stroke={INK} strokeWidth="1.6" />
        <circle cx="72" cy="18" r="2.6" fill="#ffb3c8" stroke={INK} strokeWidth="1.2" />
      </g>
    ),
  },
};

export function DecorationArt({ kind, width }) {
  const art = ART[kind] || ART.rock;
  return (
    <svg viewBox={`0 0 100 ${art.h}`} width={width} height={(width * art.h) / 100} overflow="visible" aria-hidden="true">
      {art.draw()}
    </svg>
  );
}
