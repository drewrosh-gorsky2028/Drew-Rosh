import { Blush, Eye, INK, Leg, Smile, Tube, line } from './parts.jsx';

export function Elephant({ stage, sleepy }) {
  const skin = '#aab6c9';
  const trunk = [
    'M100 70 Q106 80 104 88',
    'M100 70 Q108 84 106 96 Q105 100 100 98',
    'M100 70 Q110 86 108 100 Q106 106 99 102',
  ][stage];
  return (
    <g>
      <Tube d="M18 74 Q10 80 12 90" color={skin} width={2.5} />
      <Leg x={30} top={84} w={13} color={skin} />
      <Leg x={66} top={84} w={13} color={skin} />
      <ellipse cx="48" cy="78" rx="34" ry="24" fill={skin} {...line} />
      <Leg x={40} top={86} w={13} color={skin} />
      <Leg x={76} top={86} w={13} color={skin} />
      {stage >= 1 && (
        <g fill="#f3efe6">
          {[40, 76].map((x) => (
            <g key={x}>
              <circle cx={x - 3} cy={110} r="1.8" />
              <circle cx={x + 2} cy={110} r="1.8" />
            </g>
          ))}
        </g>
      )}
      {stage >= 2 && (
        <g>
          <path d="M28 60 Q48 50 66 58 L64 74 Q46 68 30 76Z" fill="#ff8f6b" {...line} strokeWidth="2.4" />
          <path d="M34 66 Q48 60 62 64" fill="none" stroke="#ffd56b" strokeWidth="3" strokeDasharray="3 3" />
        </g>
      )}
      <Tube d={trunk} color={skin} width={9} />
      <circle cx="88" cy="60" r="20" fill={skin} {...line} />
      {stage >= 2 && <path d="M96 76 Q104 82 112 76" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />}
      {stage >= 2 && <path d="M96 76 Q104 82 112 76" fill="none" stroke="#fffaf0" strokeWidth="3.5" strokeLinecap="round" />}
      <ellipse cx="76" cy="62" rx={[10, 13, 15][stage]} ry={[13, 16, 19][stage]} fill={skin} {...line} />
      <ellipse cx="76" cy="62" rx={[6, 8, 10][stage]} ry={[8, 11, 13][stage]} fill="#f7c9d2" />
      <Eye x={93} y={55} r={3.6} sleepy={sleepy} />
      <Blush x={96} y={66} />
    </g>
  );
}

export function Whale({ stage, sleepy }) {
  const blue = '#6a9ae0';
  const belly = '#d6e9ff';
  return (
    <g>
      {stage >= 1 && (
        <g className="spout" fill="#bfe6ff" stroke="#4e8fc7" strokeWidth="2">
          <path d={stage >= 2 ? 'M78 46 q-2 -14 0 -22 q2 8 0 22z' : 'M78 46 q-1 -8 0 -12 q1 4 0 12z'} />
          <circle cx={stage >= 2 ? 68 : 72} cy={stage >= 2 ? 24 : 34} r={stage >= 2 ? 5 : 3.5} />
          <circle cx={stage >= 2 ? 88 : 84} cy={stage >= 2 ? 22 : 33} r={stage >= 2 ? 5 : 3.5} />
          {stage >= 2 && <circle cx="78" cy="16" r="4" />}
        </g>
      )}
      <path d="M22 80 Q10 70 4 58 Q14 60 20 68 Q22 58 30 52 Q30 66 28 78Z" fill={blue} {...line} />
      <path d="M18 84 Q22 54 62 50 Q104 48 110 82 Q110 106 66 108 Q30 110 18 84Z" fill={blue} {...line} />
      <path d="M30 92 Q60 112 104 92 Q100 106 66 107 Q38 108 30 92Z" fill={belly} />
      {stage >= 2 && (
        <path d="M44 98 Q66 106 92 98 M50 102 Q68 108 86 102" fill="none" stroke="#9fc3ef" strokeWidth="2" strokeLinecap="round" />
      )}
      <path d="M18 84 Q22 54 62 50 Q104 48 110 82 Q110 106 66 108 Q30 110 18 84Z" fill="none" {...line} />
      <path d="M58 92 Q52 104 40 104 Q46 96 50 90Z" fill={blue} {...line} strokeWidth="2.4" />
      <Eye x={90} y={78} r={4} sleepy={sleepy} />
      <Blush x={96} y={88} />
      <Smile x={102} y={86} w={2.6} sleepy={sleepy} />
    </g>
  );
}

export function Rhino({ stage, sleepy }) {
  const hide = '#bcaea6';
  const horn = '#f2e8d8';
  return (
    <g>
      <Tube d="M16 72 Q8 78 10 88" color={hide} width={2.5} />
      <Leg x={28} top={86} w={13} color={hide} />
      <Leg x={62} top={86} w={13} color={hide} />
      <ellipse cx="46" cy="80" rx="34" ry="22" fill={hide} {...line} />
      {stage >= 1 && (
        <path d="M34 62 Q30 80 36 98 M60 60 Q64 80 58 100" fill="none" stroke="#9c8c84" strokeWidth="2.4" strokeLinecap="round" />
      )}
      <Leg x={38} top={88} w={13} color={hide} />
      <Leg x={72} top={88} w={13} color={hide} />
      <ellipse cx="88" cy="76" rx="20" ry="15" fill={hide} {...line} />
      {stage === 0 && <path d="M100 66 q4 -3 6 1z" fill={horn} {...line} strokeWidth="2.2" />}
      {stage === 1 && <path d="M98 66 Q104 54 106 50 Q108 60 106 70Z" fill={horn} {...line} strokeWidth="2.4" />}
      {stage >= 2 && (
        <g>
          <path d="M98 68 Q104 48 110 40 Q112 56 108 72Z" fill={horn} {...line} strokeWidth="2.4" />
          <path d="M90 64 Q93 56 96 54 Q97 60 96 66Z" fill={horn} {...line} strokeWidth="2.2" />
        </g>
      )}
      <ellipse cx="78" cy="60" rx="4" ry="7" transform="rotate(-20 78 60)" fill={hide} {...line} strokeWidth="2.4" />
      <Eye x={90} y={72} r={3.2} sleepy={sleepy} />
      <Blush x={94} y={82} />
      <path d="M103 82 q2 1 3 0" fill="none" {...line} strokeWidth="2" />
      {stage >= 2 && (
        <g>
          <ellipse cx="46" cy="54" rx="8" ry="6" fill="#ffd56b" {...line} strokeWidth="2.2" />
          <circle cx="52" cy="49" r="4.5" fill="#ffd56b" {...line} strokeWidth="2.2" />
          <path d="M56 49 l4 1 l-4 1.5z" fill="#ff9f3b" stroke={INK} strokeWidth="1.2" />
          <circle cx="53" cy="48" r="1.1" fill={INK} />
          <path d="M44 60 v4 M48 60 v4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export function PolarBear({ stage, sleepy }) {
  const fur = '#fbf7f0';
  const shade = '#e3e9f2';
  return (
    <g>
      <ellipse cx="42" cy="108" rx="12" ry="7" fill={fur} {...line} />
      <ellipse cx="78" cy="108" rx="12" ry="7" fill={fur} {...line} />
      <ellipse cx="60" cy="86" rx="30" ry="25" fill={fur} {...line} />
      <ellipse cx="60" cy="92" rx="18" ry="15" fill={shade} />
      {stage >= 1 && (
        <g stroke={INK} strokeWidth="1.6" strokeLinecap="round">
          <path d="M37 111 v-3 M42 112 v-3 M47 111 v-3 M73 111 v-3 M78 112 v-3 M83 111 v-3" />
        </g>
      )}
      {stage >= 2 && (
        <g>
          <path d="M66 86 Q80 76 94 86 Q80 96 66 86Z" fill="#8fc3e8" {...line} strokeWidth="2.2" />
          <path d="M94 86 l8 -6 v12z" fill="#8fc3e8" {...line} strokeWidth="2.2" />
          <circle cx="72" cy="85" r="1.4" fill={INK} />
        </g>
      )}
      <ellipse cx="38" cy="90" rx="8" ry="13" transform="rotate(20 38 90)" fill={fur} {...line} />
      <ellipse cx="80" cy="90" rx="8" ry="12" transform="rotate(-50 80 90)" fill={fur} {...line} />
      <circle cx="42" cy="38" r="7" fill={fur} {...line} />
      <circle cx="78" cy="38" r="7" fill={fur} {...line} />
      <circle cx="42" cy="38" r="3" fill={shade} />
      <circle cx="78" cy="38" r="3" fill={shade} />
      <circle cx="60" cy="56" r="24" fill={fur} {...line} />
      {stage >= 2 && <path d="M40 40 Q60 22 80 40 Q60 32 40 40Z" fill="#7cc6a8" {...line} strokeWidth="2.2" />}
      {stage >= 2 && <circle cx="60" cy="26" r="4.5" fill="#ff8f6b" {...line} strokeWidth="2" />}
      <ellipse cx="60" cy="66" rx="11" ry="8" fill={shade} {...line} strokeWidth="2.4" />
      <ellipse cx="60" cy="62" rx="4.5" ry="3" fill="#3b2a20" />
      <Smile x={60} y={68} w={2.6} sleepy={sleepy} />
      <Eye x={50} y={54} r={3.4} sleepy={sleepy} />
      <Eye x={70} y={54} r={3.4} sleepy={sleepy} />
      <Blush x={44} y={64} />
      <Blush x={76} y={64} />
    </g>
  );
}
