// Tiny hand-drawn icon set (no icon fonts or image files).
const PATHS = {
  coin: (
    <>
      <circle cx="12" cy="12" r="9" fill="#ffd56b" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="#e8a93a" strokeWidth="1.6" />
      <path d="M10 9.5 q2 -1.5 4 0" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  paw: (
    <g fill="currentColor">
      <ellipse cx="12" cy="16" rx="5" ry="4" />
      <circle cx="6" cy="10" r="2.2" /><circle cx="10" cy="6.5" r="2.2" /><circle cx="14" cy="6.5" r="2.2" /><circle cx="18" cy="10" r="2.2" />
    </g>
  ),
  flame: <path d="M12 3 C14 7 18 9 18 14 A6 6 0 0 1 6 14 C6 11 8 9 9 7 C10 10 11 10 12 9 C12 7 11 5 12 3Z" fill="#ff8f5a" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  calendar: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M4 10 h16 M9 3 v4 M15 3 v4" />
      <path d="M9 14.5 l2 2 l4 -4" />
    </g>
  ),
  plus: <path d="M12 5 v14 M5 12 h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />,
  close: <path d="M6 6 l12 12 M18 6 l-12 12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />,
  check: <path d="M5 12.5 l4.5 4.5 l9 -10" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />,
  gear: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5 v3 M12 18.5 v3 M2.5 12 h3 M18.5 12 h3 M5.3 5.3 l2.1 2.1 M16.6 16.6 l2.1 2.1 M5.3 18.7 l2.1 -2.1 M16.6 7.4 l2.1 -2.1" strokeLinecap="round" />
      <circle cx="12" cy="12" r="6.5" />
    </g>
  ),
  egg: <path d="M12 3 C7 3 5 10 5 14 A7 7 0 0 0 19 14 C19 10 17 3 12 3Z" fill="#fff7e8" stroke="currentColor" strokeWidth="2" />,
  zoo: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M3 20 V10 l9 -6 l9 6 v10" />
      <path d="M7 20 v-7 h10 v7 M10 13 v7 M14 13 v7" />
    </g>
  ),
  list: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M9 6 h11 M9 12 h11 M9 18 h11" />
      <circle cx="4.5" cy="6" r="1.2" fill="currentColor" /><circle cx="4.5" cy="12" r="1.2" fill="currentColor" /><circle cx="4.5" cy="18" r="1.2" fill="currentColor" />
    </g>
  ),
  brush: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4 l6 6 l-8 8 l-6 -6z" />
      <path d="M6 12 q-3 3 -2 8 q5 1 8 -2" />
    </g>
  ),
  shop: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 9 l2 -5 h12 l2 5 Z" />
      <path d="M5 9 v11 h14 V9 M10 20 v-6 h4 v6" />
    </g>
  ),
  dice: (
    <g>
      <rect x="4" y="4" width="16" height="16" rx="4" fill="#fff" stroke="currentColor" strokeWidth="2" />
      <g fill="currentColor"><circle cx="8.5" cy="8.5" r="1.5" /><circle cx="15.5" cy="15.5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="15.5" cy="8.5" r="1.5" /><circle cx="8.5" cy="15.5" r="1.5" /></g>
    </g>
  ),
  trash: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7 h16 M9 7 V4.5 h6 V7 M6 7 l1 13 h10 l1 -13" />
    </g>
  ),
};

export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`icon ${className}`} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
