import { INK } from '../animals/parts.jsx';

// Background art for each zone. Drawn in a 400×220 box and cropped to fit
// (`slice`) so it works for any pen size. Ground starts around y=80.

function Savanna() {
  return (
    <>
      <rect width="400" height="220" fill="#ffe7b0" />
      <circle cx="330" cy="40" r="22" fill="#ffd36b" />
      <path d="M0 78 Q100 62 200 76 T400 72 V220 H0Z" fill="#f2c45e" />
      <path d="M0 120 Q120 104 240 118 T400 112 V220 H0Z" fill="#e9b450" opacity=".55" />
      <g fill="#c9933a" opacity=".55">
        <path d="M40 74 v-22 M40 52 q-18 -4 -26 2 q14 -14 26 -6 q12 -8 26 6 q-8 -6 -26 -2" stroke="#b07a2a" strokeWidth="3" />
      </g>
      <g stroke="#d39a3e" strokeWidth="2" strokeLinecap="round">
        <path d="M70 160 l-3 -9 M74 160 v-10 M78 160 l3 -9" />
        <path d="M300 190 l-3 -9 M304 190 v-10 M308 190 l3 -9" />
        <path d="M200 140 l-3 -8 M204 140 v-9 M208 140 l3 -8" />
      </g>
    </>
  );
}

function Arctic() {
  return (
    <>
      <rect width="400" height="220" fill="#e4f4fb" />
      <path d="M40 80 L90 30 L140 80Z M120 80 L180 18 L240 80Z" fill="#cfe7f3" stroke="#a9d0e4" strokeWidth="2" />
      <path d="M160 36 L180 18 L200 38 L190 34 L180 42 L170 34Z" fill="#fff" />
      <path d="M0 80 Q100 70 200 82 T400 76 V220 H0Z" fill="#fbfeff" />
      <path d="M0 150 Q80 138 160 150 T320 146 T400 150 V220 H0Z" fill="#eaf6fc" />
      <ellipse cx="300" cy="120" rx="46" ry="12" fill="#bfe4f5" stroke="#9fd1ea" strokeWidth="2" />
      <path d="M270 118 l14 4 M300 114 l10 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <g fill="#fff">
        <circle cx="60" cy="20" r="2" /><circle cx="250" cy="40" r="2" /><circle cx="360" cy="24" r="2.5" /><circle cx="20" cy="50" r="1.6" />
      </g>
    </>
  );
}

function Jungle() {
  return (
    <>
      <rect width="400" height="220" fill="#d7f2c7" />
      <g fill="#7cc46a" stroke="#4f9a45" strokeWidth="2">
        <path d="M0 80 Q20 30 60 40 Q40 60 50 80Z" />
        <path d="M400 80 Q380 20 330 36 Q360 56 350 80Z" />
        <path d="M150 80 Q170 40 210 50 Q190 64 195 80Z" />
      </g>
      <path d="M0 80 Q100 70 200 80 T400 78 V220 H0Z" fill="#9ad37f" />
      <path d="M0 140 Q120 126 240 140 T400 134 V220 H0Z" fill="#8bc872" opacity=".7" />
      <path d="M90 0 Q96 40 84 70 M300 0 Q292 30 304 56" fill="none" stroke="#5c9b48" strokeWidth="3" />
      <g fill="#ff9fb8">
        <circle cx="84" cy="70" r="4" /><circle cx="304" cy="56" r="4" />
      </g>
      <g fill="#6fb35c">
        <ellipse cx="60" cy="170" rx="10" ry="4" /><ellipse cx="260" cy="190" rx="12" ry="4" /><ellipse cx="340" cy="150" rx="9" ry="3.5" />
      </g>
    </>
  );
}

function Ocean() {
  return (
    <>
      <rect width="400" height="220" fill="#d2f0ff" />
      <path d="M0 70 Q100 60 200 70 T400 66 V220 H0Z" fill="#7fcdf0" />
      <path d="M0 110 Q100 98 200 110 T400 106 V220 H0Z" fill="#5fb8e4" />
      <path d="M0 175 Q100 164 200 176 T400 172 V220 H0Z" fill="#f8e3b2" />
      <g fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".8">
        <path d="M40 92 q10 -6 20 0 q10 6 20 0" /><path d="M250 128 q10 -6 20 0 q10 6 20 0" /><path d="M150 150 q8 -5 16 0 q8 5 16 0" />
      </g>
      <g fill="#ff9f8a" stroke={INK} strokeWidth="1.5">
        <path d="M330 196 l4 -8 l4 8 l8 1 l-6 5 l2 8 l-8 -4 l-8 4 l2 -8 l-6 -5z" />
      </g>
      <circle cx="80" cy="200" r="3" fill="#fff" stroke="#e7c48a" />
    </>
  );
}

const TERRAINS = { savanna: Savanna, arctic: Arctic, jungle: Jungle, ocean: Ocean };

export function Terrain({ zone }) {
  const Art = TERRAINS[zone] || Savanna;
  return (
    <svg className="terrain" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Art />
    </svg>
  );
}

export function NurseryTerrain() {
  return (
    <svg className="terrain" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="220" fill="#fff1dc" />
      <path d="M0 60 Q100 50 200 60 T400 56 V220 H0Z" fill="#cdeba8" />
      <g fill="#bfe296">
        <circle cx="40" cy="120" r="14" /><circle cx="340" cy="170" r="18" /><circle cx="210" cy="200" r="12" />
      </g>
      <g fill="#ffd1dc"><circle cx="70" cy="40" r="3" /><circle cx="300" cy="30" r="3" /><circle cx="180" cy="22" r="2.5" /></g>
    </svg>
  );
}
