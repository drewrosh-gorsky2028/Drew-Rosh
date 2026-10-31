import { line } from './parts.jsx';

/** A speckled egg that can split in half for hatching. */
export function Egg({ cracked }) {
  return (
    <svg viewBox="0 0 120 120" className={`egg ${cracked ? 'egg--cracked' : ''}`} aria-hidden="true">
      <g className="egg-bottom">
        <path d="M30 76 Q30 112 60 112 Q90 112 90 76 L80 70 L70 78 L60 70 L50 78 L40 70Z" fill="#fff7e8" {...line} />
        <circle cx="48" cy="96" r="3" fill="#ffcf8a" />
        <circle cx="70" cy="100" r="2.5" fill="#9fd9c4" />
      </g>
      <g className="egg-top">
        <path d="M30 76 Q30 30 60 26 Q90 30 90 76 L80 70 L70 78 L60 70 L50 78 L40 70Z" fill="#fff7e8" {...line} />
        <circle cx="50" cy="48" r="4" fill="#9fd9c4" />
        <circle cx="70" cy="56" r="3" fill="#ffcf8a" />
        <circle cx="62" cy="40" r="2.5" fill="#ffb3c1" />
      </g>
    </svg>
  );
}
