import { Blush, Eye, INK, Smile, arcPoints, fluffPath, line } from './parts.jsx';

export function Bunny({ stage, sleepy }) {
  const fur = '#fff3e6';
  const earLen = [14, 18, 22][stage];
  const droop = sleepy ? 48 : 0;
  return (
    <g>
      {stage >= 1 && <circle cx="86" cy="98" r="8" fill="#fff" {...line} />}
      <g transform={`rotate(${-12 - droop} 52 40)`}>
        <ellipse cx="52" cy={40 - earLen} rx="7.5" ry={earLen} fill={fur} {...line} />
        <ellipse cx="52" cy={40 - earLen} rx="3.5" ry={earLen - 5} fill="#ffc7cf" />
      </g>
      <g transform={`rotate(${12 + droop} 68 40)`}>
        <ellipse cx="68" cy={40 - earLen} rx="7.5" ry={earLen} fill={fur} {...line} />
        <ellipse cx="68" cy={40 - earLen} rx="3.5" ry={earLen - 5} fill="#ffc7cf" />
      </g>
      <ellipse cx="60" cy="90" rx="26" ry="23" fill={fur} {...line} />
      <ellipse cx="60" cy="95" rx="15" ry="14" fill="#fff" />
      <circle cx="60" cy="58" r="22" fill={fur} {...line} />
      {stage >= 2 && <path d="M55 37 q5 -7 10 0" fill="none" {...line} />}
      <Eye x={51} y={57} sleepy={sleepy} />
      <Eye x={69} y={57} sleepy={sleepy} />
      <Blush x={45} y={65} />
      <Blush x={75} y={65} />
      <path d="M57.5 62 h5 l-2.5 3z" fill="#ff8ea0" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      <Smile x={60} y={67} w={2.6} sleepy={sleepy} />
      {stage >= 2 && (
        <g stroke={INK} strokeWidth="1.4" strokeLinecap="round">
          <path d="M42 62 h-8 M42 66 l-7 3 M78 62 h8 M78 66 l7 3" />
        </g>
      )}
      <ellipse cx="48" cy="111" rx="9" ry="5" fill={fur} {...line} />
      <ellipse cx="72" cy="111" rx="9" ry="5" fill={fur} {...line} />
    </g>
  );
}

export function Penguin({ stage, sleepy }) {
  const body = stage === 0 ? '#aab3c4' : '#3d4a63';
  return (
    <g>
      <ellipse cx="50" cy="112" rx="9" ry="4.5" fill="#ffaa4c" {...line} />
      <ellipse cx="70" cy="112" rx="9" ry="4.5" fill="#ffaa4c" {...line} />
      <ellipse cx="32" cy="82" rx="7" ry="16" transform="rotate(20 32 82)" fill={body} {...line} />
      <ellipse cx="88" cy="82" rx="7" ry="16" transform="rotate(-20 88 82)" fill={body} {...line} />
      {stage === 0 ? (
        <path d={fluffPath(60, 76, 28, 34, 16, 3)} fill={body} {...line} />
      ) : (
        <ellipse cx="60" cy="76" rx="28" ry="35" fill={body} {...line} />
      )}
      <path d="M60 50 C44 48 40 62 43 72 C40 86 44 104 60 106 C76 104 80 86 77 72 C80 62 76 48 60 50Z" fill="#fff" />
      {stage >= 1 && (
        <path d="M54 43 q2 -9 6 -10 q-1 6 2 9 q3 -5 7 -5 q-3 4 -3 7" fill={body} {...line} strokeWidth="2.4" />
      )}
      <Eye x={52} y={62} sleepy={sleepy} />
      <Eye x={68} y={62} sleepy={sleepy} />
      <Blush x={47} y={71} />
      <Blush x={73} y={71} />
      <path d="M54 68 L66 68 L60 75Z" fill="#ffaa4c" {...line} strokeWidth="2.4" />
      {stage >= 2 && (
        <g>
          <path d="M38 80 Q60 92 82 80 L82 86 Q60 98 38 86Z" fill="#ff6f61" {...line} strokeWidth="2.4" />
          <path d="M72 88 l4 16 l7 -3 l-5 -14z" fill="#ff6f61" {...line} strokeWidth="2.4" />
          <path d="M46 86 l2 -4 M54 89 l2 -4 M62 90 l2 -4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export function Hedgehog({ stage, sleepy }) {
  const spikeCount = [8, 11, 15][stage];
  const spikeLen = [6, 10, 13][stage];
  const outer = arcPoints(56, 88, 32 + spikeLen, 22 + spikeLen, Math.PI * 0.95, Math.PI * 2.05, spikeCount * 2);
  const inner = arcPoints(56, 88, 30, 20, Math.PI * 0.95, Math.PI * 2.05, spikeCount * 2);
  const spikes = outer.map((p, i) => (i % 2 ? inner[i] : p));
  const d = 'M' + spikes.map((p) => p.map((n) => n.toFixed(1)).join(' ')).join(' L') + ' L56 104Z';
  return (
    <g>
      <path d={d} fill="#8f6249" {...line} />
      <ellipse cx="56" cy="92" rx="32" ry="18" fill="#a8775b" {...line} />
      {stage >= 2 && (
        <g>
          <circle cx="50" cy="60" r="9" fill="#ff6b6b" {...line} />
          <path d="M50 51 q1 -5 4 -6" fill="none" {...line} strokeWidth="2.2" />
          <ellipse cx="57" cy="47" rx="4" ry="2.2" fill="#7bc96f" stroke={INK} strokeWidth="1.6" />
        </g>
      )}
      <ellipse cx="38" cy="109" rx="7" ry="4" fill="#a8775b" {...line} />
      <ellipse cx="68" cy="109" rx="7" ry="4" fill="#a8775b" {...line} />
      <path d="M72 78 C88 74 102 84 102 92 C102 100 88 106 74 104Z" fill="#f6dcc0" {...line} />
      <circle cx="102" cy="91" r="3.5" fill="#3b2a20" />
      <Eye x={86} y={87} r={3.6} sleepy={sleepy} />
      <Blush x={88} y={97} rx={4} ry={2.6} />
      <circle cx="80" cy="78" r="4" fill="#f6dcc0" {...line} strokeWidth="2.2" />
      {stage >= 1 && <path d="M94 99 q3 2 5 0" fill="none" {...line} strokeWidth="2" />}
    </g>
  );
}

export function Duck({ stage, sleepy }) {
  const body = ['#ffd84d', '#ffe9a0', '#fffaf0'][stage];
  return (
    <g>
      <path d="M48 106 v6 M64 106 v6" {...line} />
      <path d="M42 112 h12 M58 112 h12" stroke="#ff9f3b" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 84 L18 72 L24 90Z" fill={body} {...line} />
      {stage === 0 ? (
        <path d={fluffPath(56, 90, 28, 18, 14, 2.5)} fill={body} {...line} />
      ) : (
        <ellipse cx="56" cy="90" rx="30" ry="19" fill={body} {...line} />
      )}
      <path d="M40 86 Q54 80 64 90 Q54 100 40 94Z" fill={stage >= 2 ? '#f1e6d2' : body} {...line} strokeWidth="2.4" />
      {stage >= 2 && <path d="M46 88 l8 2 M45 92 l8 1" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />}
      <circle cx="80" cy="62" r="17" fill={body} {...line} />
      {stage >= 1 && <path d="M78 45 q-2 -8 4 -10 q-1 5 3 8" fill={body} {...line} strokeWidth="2.4" />}
      <path d="M94 62 q12 0 12 5 q-2 5 -12 4z" fill="#ff9f3b" {...line} strokeWidth="2.4" />
      <Eye x={85} y={58} sleepy={sleepy} />
      <Blush x={84} y={69} />
    </g>
  );
}
