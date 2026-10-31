import { Blush, Eye, INK, Leg, Smile, Tube, line } from './parts.jsx';

export function Panda({ stage, sleepy }) {
  const black = '#3a3340';
  const white = '#fbf8f4';
  return (
    <g>
      <ellipse cx="44" cy="109" rx="11" ry="7" fill={black} {...line} />
      <ellipse cx="76" cy="109" rx="11" ry="7" fill={black} {...line} />
      <ellipse cx="60" cy="88" rx="28" ry="24" fill={white} {...line} />
      {stage >= 2 && <path d="M33 80 Q60 68 87 80 L86 88 Q60 78 34 88Z" fill={black} />}
      {stage >= 1 && (
        <g>
          <rect x="74" y="58" width="6" height="46" rx="3" fill="#8fcf6a" transform="rotate(12 77 80)" {...line} strokeWidth="2.2" />
          <path d="M73 70 h8 M75 86 h8" stroke={INK} strokeWidth="1.6" transform="rotate(12 77 80)" />
          {stage >= 2 && (
            <g fill="#6fbf54" stroke={INK} strokeWidth="1.8">
              <path d="M82 62 q12 -8 16 -2 q-8 6 -16 2z" />
              <path d="M80 66 q10 2 12 10 q-10 -2 -12 -10z" />
            </g>
          )}
        </g>
      )}
      <ellipse cx="38" cy="90" rx="8" ry="13" transform="rotate(25 38 90)" fill={black} {...line} />
      <ellipse cx="82" cy="88" rx="8" ry="13" transform="rotate(-35 82 88)" fill={black} {...line} />
      <circle cx="40" cy="36" r="9" fill={black} {...line} />
      <circle cx="80" cy="36" r="9" fill={black} {...line} />
      <circle cx="60" cy="55" r="25" fill={white} {...line} />
      <ellipse cx="50" cy="56" rx="7" ry="9.5" transform="rotate(25 50 56)" fill={black} />
      <ellipse cx="70" cy="56" rx="7" ry="9.5" transform="rotate(-25 70 56)" fill={black} />
      {sleepy ? (
        <g>
          <path d="M46.5 56 q3.5 3.5 7 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M66.5 56 q3.5 3.5 7 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <Eye x={51} y={55} r={3.2} ring />
          <Eye x={69} y={55} r={3.2} ring />
        </g>
      )}
      <Blush x={43} y={67} />
      <Blush x={77} y={67} />
      <ellipse cx="60" cy="64" rx="4" ry="2.8" fill={black} />
      <Smile x={60} y={68} w={2.6} sleepy={sleepy} />
    </g>
  );
}

export function Giraffe({ stage, sleepy }) {
  const coat = '#f7c766';
  const spot = '#cf8740';
  const headY = [52, 40, 28][stage];
  const spots = [
    [40, 76, 5],
    [56, 72, 4.5],
    [64, 84, 4],
    [46, 86, 3.5],
    [30, 82, 3.5],
    [74, headY + 30, 3.5],
    [80, headY + 18, 3],
    [70, 64, 3],
  ].slice(0, [3, 6, 8][stage]);
  return (
    <g>
      <Tube d="M28 76 Q18 84 20 96" color={coat} width={3} />
      {stage >= 1 && <ellipse cx="20" cy="98" rx="3.5" ry="5" fill="#8a5a2b" {...line} strokeWidth="2" />}
      <Leg x={34} top={82} w={9} color={coat} />
      <Leg x={64} top={82} w={9} color={coat} />
      <path d={`M58 74 L72 72 L${92} ${headY + 6} L${80} ${headY}Z`} fill={coat} {...line} />
      {stage >= 2 && (
        <path
          d={`M60 70 Q68 ${headY + 30} 76 ${headY + 2}`}
          fill="none"
          stroke="#b0662a"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1 6"
        />
      )}
      <ellipse cx="50" cy="78" rx="27" ry="14" fill={coat} {...line} />
      <Leg x={42} top={84} w={9} color={coat} />
      <Leg x={72} top={84} w={9} color={coat} />
      {spots.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r * 1.15} ry={r} fill={spot} />
      ))}
      {stage >= 1 && (
        <g>
          <path d={`M80 ${headY - 6} v-8 M90 ${headY - 6} v-8`} {...line} />
          <circle cx={80} cy={headY - 15} r="3.4" fill="#8a5a2b" {...line} strokeWidth="2" />
          <circle cx={90} cy={headY - 15} r="3.4" fill="#8a5a2b" {...line} strokeWidth="2" />
        </g>
      )}
      <ellipse cx={74} cy={headY - 2} rx="6" ry="3.5" transform={`rotate(-25 74 ${headY - 2})`} fill={coat} {...line} strokeWidth="2.4" />
      <ellipse cx={88} cy={headY + 2} rx="14" ry="11" fill={coat} {...line} />
      <ellipse cx={99} cy={headY + 7} rx="8" ry="6.5" fill="#fbe2a8" {...line} strokeWidth="2.4" />
      <circle cx={101} cy={headY + 5} r="1.3" fill={INK} />
      <Eye x={89} y={headY} r={3.4} sleepy={sleepy} />
      <Blush x={91} y={headY + 9} rx={3.5} ry={2.4} />
    </g>
  );
}

export function Kangaroo({ stage, sleepy }) {
  const coat = '#d9925a';
  const belly = '#f6d3a9';
  const tail = ['M44 100 Q30 104 24 108', 'M44 100 Q24 106 14 110', 'M44 100 Q20 106 8 111'][stage];
  return (
    <g>
      <Tube d={tail} color={coat} width={7} />
      <ellipse cx="68" cy="110" rx="17" ry="5" fill={coat} {...line} />
      <ellipse cx="54" cy="86" rx="21" ry="25" transform="rotate(-12 54 86)" fill={coat} {...line} />
      <ellipse cx="59" cy="90" rx="13" ry="17" transform="rotate(-12 59 90)" fill={belly} />
      {stage >= 1 && <path d="M50 96 Q60 102 70 94" fill="none" {...line} strokeWidth="2.2" />}
      {stage >= 2 && (
        <g>
          <ellipse cx="62" cy="91" rx="7" ry="6" fill={coat} {...line} strokeWidth="2.2" />
          <ellipse cx="57" cy="85" rx="2" ry="4" fill={coat} {...line} strokeWidth="1.8" />
          <Eye x={63} y={90} r={1.8} sleepy={sleepy} />
          <circle cx="68" cy="92" r="1.2" fill={INK} />
          <path d="M50 96 Q60 102 70 94" fill="none" {...line} strokeWidth="2.2" />
        </g>
      )}
      <ellipse cx="74" cy="78" rx="4" ry="7" transform="rotate(-40 74 78)" fill={coat} {...line} strokeWidth="2.4" />
      <ellipse cx="64" cy="20" rx="5" ry={[9, 12, 14][stage]} transform="rotate(-10 64 34)" fill={coat} {...line} />
      <ellipse cx="74" cy="20" rx="5" ry={[9, 12, 14][stage]} transform="rotate(14 74 34)" fill={coat} {...line} />
      <ellipse cx="70" cy="46" rx="15" ry="14" fill={coat} {...line} />
      <ellipse cx="84" cy="51" rx="9" ry="7" fill={belly} {...line} strokeWidth="2.4" />
      <ellipse cx="91" cy="49" rx="2.6" ry="2" fill={INK} />
      <Eye x={74} y={43} r={3.4} sleepy={sleepy} />
      <Blush x={74} y={53} />
    </g>
  );
}

export function Flamingo({ stage, sleepy }) {
  const pink = ['#e7dde2', '#ffc2d4', '#ff8fb1'][stage];
  const deep = ['#cfc3c9', '#ff9fbb', '#f2668f'][stage];
  return (
    <g>
      <path d="M58 72 V112 M54 112 h8" {...line} stroke="#e46f86" strokeWidth="3.5" />
      {stage >= 1 ? (
        <path d="M62 72 L68 88 L58 92" fill="none" {...line} stroke="#e46f86" strokeWidth="3.5" />
      ) : (
        <path d="M64 72 V112 M60 112 h8" {...line} stroke="#e46f86" strokeWidth="3.5" />
      )}
      <Tube d="M74 58 C88 52 86 40 76 34 C68 28 72 18 82 18" color={pink} width={stage === 0 ? 7 : 6} />
      <path d="M30 58 L18 52 L22 62 L16 66 L30 66Z" fill={deep} {...line} strokeWidth="2.4" />
      <ellipse cx="54" cy="60" rx="26" ry="16" fill={pink} {...line} />
      <path d="M38 56 Q54 48 66 60 Q52 70 38 64Z" fill={deep} {...line} strokeWidth="2.4" />
      {stage >= 2 && <path d="M44 58 l10 3 M42 62 l10 2" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />}
      <circle cx="84" cy="20" r="10" fill={pink} {...line} />
      {stage >= 2 && <path d="M80 10 q2 -6 6 -6 q-1 4 1 6" fill={pink} {...line} strokeWidth="2" />}
      <path d="M92 18 q8 0 9 6 q0 6 -5 9 q0 -5 -5 -7z" fill="#fff4e8" {...line} strokeWidth="2.4" />
      <path d="M99 27 q1 4 -3 6 q0 -3 -1 -4z" fill={INK} />
      <Eye x={86} y={18} r={2.8} sleepy={sleepy} />
      <Blush x={83} y={25} rx={3.4} ry={2.2} />
    </g>
  );
}
