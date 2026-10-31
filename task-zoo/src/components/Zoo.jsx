import { useCallback, useEffect, useRef, useState } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { DECORATIONS } from '../data/decorations.js';
import { ZONES } from '../data/zones.js';
import { DecorationArt } from './scenery/Decorations.jsx';
import { Terrain } from './scenery/Terrain.jsx';
import { Wanderer } from './Wanderer.jsx';
import { Icon } from './ui/Icon.jsx';

const DRAG_THRESHOLD = 6;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function Habitat({ category, animals, decorations, decorating, selectedId, onOpenTask, onDecorPointerDown, registerRef, onSelectAction }) {
  const zone = ZONES[category.zone] || ZONES.savanna;
  return (
    <section
      className={`pen habitat habitat--${zone.id}`}
      id={`habitat-${category.id}`}
      ref={(el) => registerRef(category.id, el)}
      aria-label={`${category.name} habitat (${zone.name})`}
    >
      <Terrain zone={zone.id} />
      <div className="pen-head">
        <h3>{category.name}</h3>
        <span className="zone-badge" style={{ background: zone.color, color: zone.ink }}>
          {zone.name}
        </span>
        <span className="pen-count">{animals.length} {animals.length === 1 ? 'animal' : 'animals'}</span>
      </div>

      {decorations.map((d) => {
        const item = DECORATIONS[d.kind];
        return (
          <div
            key={d.id}
            className={`decor ${decorating ? 'decor--editable' : ''} ${selectedId === d.id ? 'is-selected' : ''}`}
            style={{ left: `${d.x}%`, top: `${d.y}%`, zIndex: Math.round(d.y) }}
            onPointerDown={decorating ? (e) => onDecorPointerDown(e, d) : undefined}
          >
            <DecorationArt kind={d.kind} width={item?.w || 50} />
            {decorating && selectedId === d.id && (
              <div className="decor-actions" onPointerDown={(e) => e.stopPropagation()}>
                <button onClick={() => onSelectAction('store', d)}>Put away</button>
                <button onClick={() => onSelectAction('sell', d)}>
                  Sell +{Math.floor((item?.price || 0) / 2)}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {animals.map((t) => (
        <Wanderer key={t.id} task={t} onOpen={onOpenTask} disabled={decorating} />
      ))}

      {animals.length === 0 && (
        <p className="pen-empty">Finish a {category.name} task and its animal will move in here.</p>
      )}
    </section>
  );
}

export function Zoo({ onOpenTask, onOpenShop, decorating, setDecorating }) {
  const { state, dispatch } = useZoo();
  const [drag, setDrag] = useState(null); // { decor, startX, startY, x, y, moved }
  const [selectedId, setSelectedId] = useState(null);
  const habitatRefs = useRef(new Map());
  const trayRef = useRef(null);
  const dragRef = useRef(null);
  dragRef.current = drag;

  const registerRef = useCallback((id, el) => {
    if (el) habitatRefs.current.set(id, el);
    else habitatRefs.current.delete(id);
  }, []);

  const stored = state.decorations.filter((d) => !d.habitatId || !state.categories.some((c) => c.id === d.habitatId));

  const startDrag = (e, decor) => {
    e.preventDefault();
    setDrag({ decor, startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, moved: false });
  };

  const hitHabitat = (x, y) => {
    for (const [id, el] of habitatRefs.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return { id, r };
    }
    return null;
  };

  useEffect(() => {
    if (!drag) return undefined;
    const onMove = (e) => {
      const d = dragRef.current;
      const moved = d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
      setDrag({ ...d, x: e.clientX, y: e.clientY, moved });
      // Gently scroll when dragging near the screen edge (handy on phones).
      if (e.clientY < 70) window.scrollBy(0, -14);
      else if (e.clientY > window.innerHeight - 90) window.scrollBy(0, 14);
    };
    const onUp = (e) => {
      const d = dragRef.current;
      setDrag(null);
      if (!d) return;
      const { decor } = d;
      if (!d.moved) {
        // A tap: tray items get placed; placed items get selected.
        if (!decor.habitatId) {
          const first = state.categories[0];
          if (first) dispatch({ type: 'PLACE_DECOR', id: decor.id, habitatId: first.id, x: 20 + Math.random() * 60, y: 60 + Math.random() * 30 });
        } else {
          setSelectedId((s) => (s === decor.id ? null : decor.id));
        }
        return;
      }
      const tray = trayRef.current?.getBoundingClientRect();
      if (tray && e.clientX >= tray.left && e.clientX <= tray.right && e.clientY >= tray.top && e.clientY <= tray.bottom) {
        dispatch({ type: 'STORE_DECOR', id: decor.id });
        return;
      }
      const hit = hitHabitat(e.clientX, e.clientY);
      if (hit) {
        const x = clamp(((e.clientX - hit.r.left) / hit.r.width) * 100, 4, 96);
        const y = clamp(((e.clientY - hit.r.top) / hit.r.height) * 100, 25, 99);
        dispatch({ type: 'PLACE_DECOR', id: decor.id, habitatId: hit.id, x, y });
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [drag !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelectAction = (action, decor) => {
    dispatch({ type: action === 'sell' ? 'SELL_DECOR' : 'STORE_DECOR', id: decor.id });
    setSelectedId(null);
  };

  const completed = state.tasks.filter((t) => t.completedAt);

  return (
    <section className={`zoo ${decorating ? 'zoo--decorating' : ''}`} aria-labelledby="zoo-title">
      <div className="section-head">
        <h2 id="zoo-title">The Zoo</h2>
        <div className="section-actions">
          <button className="btn btn--ghost" onClick={onOpenShop}>
            <Icon name="shop" size={18} /> Shop
          </button>
          <button
            className={`btn ${decorating ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => {
              setDecorating((v) => !v);
              setSelectedId(null);
            }}
            aria-pressed={decorating}
          >
            <Icon name={decorating ? 'check' : 'brush'} size={18} /> {decorating ? 'Done' : 'Decorate'}
          </button>
        </div>
      </div>

      {decorating && (
        <div className="tray" ref={trayRef}>
          <p className="tray-hint">
            Drag items into a habitat. Tap a placed item for options. Drop it back here to put it away.
          </p>
          <div className="tray-items">
            {stored.length === 0 && (
              <button className="btn btn--small" onClick={onOpenShop}>
                <Icon name="coin" size={16} /> Buy decorations
              </button>
            )}
            {stored.map((d) => (
              <div key={d.id} className="tray-item" onPointerDown={(e) => startDrag(e, d)} title={DECORATIONS[d.kind]?.name}>
                <DecorationArt kind={d.kind} width={46} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="habitats">
        {state.categories.map((c) => (
          <Habitat
            key={c.id}
            category={c}
            animals={completed.filter((t) => t.categoryId === c.id)}
            decorations={state.decorations.filter((d) => d.habitatId === c.id && d.id !== (drag?.moved && drag.decor.id))}
            decorating={decorating}
            selectedId={selectedId}
            onOpenTask={onOpenTask}
            onDecorPointerDown={startDrag}
            registerRef={registerRef}
            onSelectAction={onSelectAction}
          />
        ))}
      </div>

      {drag?.moved && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <DecorationArt kind={drag.decor.kind} width={DECORATIONS[drag.decor.kind]?.w || 50} />
        </div>
      )}
    </section>
  );
}
