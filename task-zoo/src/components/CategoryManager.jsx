import { useState } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { ZONE_LIST } from '../data/zones.js';
import { Terrain } from './scenery/Terrain.jsx';
import { Modal } from './ui/Modal.jsx';
import { Icon } from './ui/Icon.jsx';

function ZonePicker({ value, onChange, name }) {
  return (
    <div className="zone-picker" role="radiogroup" aria-label={`Zone for ${name}`}>
      {ZONE_LIST.map((z) => (
        <button
          type="button"
          key={z.id}
          role="radio"
          aria-checked={value === z.id}
          className={value === z.id ? 'is-active' : ''}
          onClick={() => onChange(z.id)}
          title={z.name}
        >
          <span className="zone-swatch">
            <Terrain zone={z.id} />
          </span>
          <small>{z.name}</small>
        </button>
      ))}
    </div>
  );
}

export function CategoryManager({ onClose }) {
  const { state, dispatch } = useZoo();
  const [newName, setNewName] = useState('');
  const [newZone, setNewZone] = useState('jungle');

  const add = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    dispatch({ type: 'ADD_CATEGORY', name: newName.trim(), zone: newZone });
    setNewName('');
  };

  return (
    <Modal title="Categories & zones" onClose={onClose} wide>
      <p className="muted">Each category becomes a habitat. Pick the terrain its animals live on.</p>
      <ul className="cat-list">
        {state.categories.map((c) => {
          const count = state.tasks.filter((t) => t.categoryId === c.id).length;
          return (
            <li key={c.id}>
              <div className="cat-row">
                <input
                  value={c.name}
                  aria-label="Category name"
                  onChange={(e) => dispatch({ type: 'UPDATE_CATEGORY', id: c.id, changes: { name: e.target.value } })}
                  onBlur={(e) => !e.target.value.trim() && dispatch({ type: 'UPDATE_CATEGORY', id: c.id, changes: { name: 'Untitled' } })}
                />
                <span className="muted">{count} tasks</span>
                <button
                  className="icon-btn"
                  aria-label={`Delete ${c.name}`}
                  disabled={state.categories.length <= 1}
                  title={count ? 'Tasks will move to the first other category' : 'Delete'}
                  onClick={() => dispatch({ type: 'DELETE_CATEGORY', id: c.id })}
                >
                  <Icon name="trash" />
                </button>
              </div>
              <ZonePicker value={c.zone} name={c.name} onChange={(zone) => dispatch({ type: 'UPDATE_CATEGORY', id: c.id, changes: { zone } })} />
            </li>
          );
        })}
      </ul>

      <form className="cat-new" onSubmit={add}>
        <h3>New category</h3>
        <div className="cat-row">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Errands" aria-label="New category name" />
          <button className="btn btn--primary btn--small" type="submit">
            <Icon name="plus" size={16} /> Add
          </button>
        </div>
        <ZonePicker value={newZone} name="new category" onChange={setNewZone} />
      </form>
    </Modal>
  );
}
