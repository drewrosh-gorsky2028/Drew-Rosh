// Shared drawing pieces so every animal has the same friendly style:
// warm brown outlines, sparkly eyes, rosy cheeks.

export const INK = '#5a3d2b';
export const BLUSH = '#ff9aa2';

export const line = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
};

export function Eye({ x, y, r = 4, sleepy, ring }) {
  if (sleepy) {
    return <path d={`M${x - r} ${y} Q${x} ${y + r * 1.1} ${x + r} ${y}`} fill="none" {...line} strokeWidth={2.6} />;
  }
  return (
    <g className="eye">
      {ring && <circle cx={x} cy={y} r={r + 1.8} fill="#fff" />}
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.15} fill="#3b2a20" />
      <circle cx={x - r * 0.35} cy={y - r * 0.45} r={r * 0.38} fill="#fff" />
    </g>
  );
}

export function Blush({ x, y, rx = 4.5, ry = 3 }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={BLUSH} opacity="0.6" />;
}

export function Smile({ x, y, w = 3, sleepy }) {
  if (sleepy) return <circle cx={x} cy={y + 1} r={1.6} fill={INK} />;
  return (
    <path
      d={`M${x - w} ${y} q${w / 2} ${w * 0.8} ${w} 0 q${w / 2} ${w * 0.8} ${w} 0`}
      fill="none"
      {...line}
      strokeWidth={2.2}
    />
  );
}

/** Thick outlined stroke (for necks, trunks, tails). */
export function Tube({ d, color, width = 8 }) {
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Points evenly spread around an ellipse arc, used for spikes and fluff. */
export function arcPoints(cx, cy, rx, ry, from, to, count) {
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const a = from + ((to - from) * i) / count;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
}

/** A scalloped "fluffy" outline: bumps around an ellipse. */
export function fluffPath(cx, cy, rx, ry, bumps = 12, depth = 3) {
  const pts = arcPoints(cx, cy, rx, ry, 0, Math.PI * 2, bumps);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = (Math.PI * 2 * (i - 0.5)) / bumps;
    const qx = cx + Math.cos(a) * (rx + depth);
    const qy = cy + Math.sin(a) * (ry + depth);
    d += ` Q${qx.toFixed(1)} ${qy.toFixed(1)} ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  }
  return d + 'Z';
}

export function Leg({ x, top, bottom = 112, w = 11, color }) {
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={bottom - top} rx={w / 2.2} fill={color} {...line} />
    </g>
  );
}
