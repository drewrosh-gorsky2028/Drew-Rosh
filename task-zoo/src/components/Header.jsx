import { useEffect, useRef, useState } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { animalsCollected, doneThisWeek, speciesCollected, streak } from '../lib/stats.js';
import { ANIMAL_LIST } from './animals/index.js';
import { Icon } from './ui/Icon.jsx';

export function Header({ onOpenShop, onOpenCategories }) {
  const { state } = useZoo();
  const lastCoins = useRef(state.coins);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (state.coins > lastCoins.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 700);
      lastCoins.current = state.coins;
      return () => clearTimeout(t);
    }
    lastCoins.current = state.coins;
  }, [state.coins]);
  const stats = [
    {
      icon: 'paw',
      value: animalsCollected(state),
      label: 'animals',
      title: `${speciesCollected(state)} of ${ANIMAL_LIST.length} species collected`,
    },
    { icon: 'calendar', value: doneThisWeek(state), label: 'this week', title: 'Tasks completed since Monday' },
    { icon: 'flame', value: streak(state), label: 'day streak', title: 'Days in a row with a completed task' },
  ];

  return (
    <header className="app-header">
      <div className="brand">
        <svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true">
          <circle cx="32" cy="34" r="28" fill="#ffb35c" />
          <path d="M14 30 L32 12 L50 30" fill="#ff8f5a" stroke="#5a3d2b" strokeWidth="3" strokeLinejoin="round" />
          <rect x="18" y="30" width="28" height="20" rx="3" fill="#fff6ea" stroke="#5a3d2b" strokeWidth="3" />
          <path d="M25 30 v20 M32 30 v20 M39 30 v20" stroke="#5a3d2b" strokeWidth="2.4" />
        </svg>
        <h1>
          Task <span>Zoo</span>
        </h1>
      </div>

      <ul className="stats" aria-label="Your stats">
        {stats.map((s) => (
          <li key={s.label} title={s.title}>
            <Icon name={s.icon} size={18} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>

      <div className="header-actions">
        <button className={`coin-pill ${bump ? 'bump' : ''}`} onClick={onOpenShop} title="Open the shop">
          <Icon name="coin" size={20} />
          <strong>{state.coins}</strong>
          <span className="sr-only">coins — open shop</span>
        </button>
        <button className="icon-btn" onClick={onOpenCategories} aria-label="Categories and zones" title="Categories & zones">
          <Icon name="gear" />
        </button>
      </div>
    </header>
  );
}
