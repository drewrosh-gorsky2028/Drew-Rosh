import { useState } from 'react';
import { useZoo } from '../state/ZooContext.jsx';
import { SIZE_LIST } from '../data/sizes.js';
import { ZONES } from '../data/zones.js';
import { ANIMALS, animalsForSize } from './animals/index.js';
import { AnimalSprite } from './animals/AnimalSprite.jsx';
import { Modal } from './ui/Modal.jsx';
import { Icon } from './ui/Icon.jsx';
import { pick, uid } from '../lib/id.js';

export function TaskForm({ taskId, onClose, onSaved }) {
  const { state, dispatch } = useZoo();
  const existing = state.tasks.find((t) => t.id === taskId);
  const [title, setTitle] = useState(existing?.title || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [size, setSize] = useState(existing?.size || 'small');
  const [animal, setAnimal] = useState(existing?.animal || 'random');
  const [categoryId, setCategoryId] = useState(existing?.categoryId || state.categories[0]?.id);
  const [dueDate, setDueDate] = useState(existing?.dueDate || '');
  const [subtasks, setSubtasks] = useState(existing?.subtasks || []);
  const [draft, setDraft] = useState('');

  const tier = animalsForSize(size);

  const changeSize = (next) => {
    setSize(next);
    if (animal !== 'random' && ANIMALS[animal]?.size !== next) setAnimal('random');
  };

  const addSubtask = () => {
    const text = draft.trim();
    if (!text) return;
    setSubtasks((s) => [...s, { id: uid('sub'), text, done: false }]);
    setDraft('');
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const pending = draft.trim() ? [...subtasks, { id: uid('sub'), text: draft.trim(), done: false }] : subtasks;
    const data = {
      title: title.trim(),
      notes: notes.trim(),
      size,
      animal: animal === 'random' ? pick(tier).id : animal,
      categoryId,
      dueDate: dueDate || null,
      subtasks: pending.filter((s) => s.text.trim()),
    };
    if (existing) {
      dispatch({ type: 'UPDATE_TASK', id: existing.id, changes: data });
      onSaved?.(existing.id);
    } else {
      const id = uid('task');
      dispatch({ type: 'ADD_TASK', id, task: data });
      onSaved?.(id);
    }
  };

  return (
    <Modal title={existing ? 'Edit task' : 'New task'} onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span>Task</span>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Plan the garden" required maxLength={120} />
        </label>

        <fieldset className="field">
          <legend>Size</legend>
          <div className="segmented">
            {SIZE_LIST.map((s) => (
              <button type="button" key={s.id} className={size === s.id ? 'is-active' : ''} onClick={() => changeSize(s.id)}>
                <strong>{s.name}</strong>
                <small>
                  {s.hint} · {s.coins}
                  <Icon name="coin" size={12} />
                </small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Animal</legend>
          <div className="animal-picker">
            <button type="button" className={animal === 'random' ? 'is-active' : ''} onClick={() => setAnimal('random')}>
              <Icon name="dice" size={34} />
              <small>Surprise</small>
            </button>
            {tier.map((a) => (
              <button type="button" key={a.id} className={animal === a.id ? 'is-active' : ''} onClick={() => setAnimal(a.id)}>
                <AnimalSprite animal={a.id} stage={2} size={46} />
                <small>{a.name}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="field-row">
          <label className="field">
            <span>Category</span>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {state.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({ZONES[c.zone]?.name})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Due date</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
        </div>

        <fieldset className="field">
          <legend>Subtasks <small className="muted">— each one helps your animal grow</small></legend>
          <ul className="subtask-edit">
            {subtasks.map((s, i) => (
              <li key={s.id}>
                <input
                  value={s.text}
                  aria-label={`Subtask ${i + 1}`}
                  onChange={(e) => setSubtasks((all) => all.map((x) => (x.id === s.id ? { ...x, text: e.target.value } : x)))}
                />
                <button type="button" className="icon-btn" aria-label="Remove subtask" onClick={() => setSubtasks((all) => all.filter((x) => x.id !== s.id))}>
                  <Icon name="trash" size={18} />
                </button>
              </li>
            ))}
          </ul>
          <div className="subtask-add">
            <input
              value={draft}
              placeholder="Add a step…"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSubtask();
                }
              }}
            />
            <button type="button" className="btn btn--small" onClick={addSubtask}>
              <Icon name="plus" size={16} /> Add
            </button>
          </div>
        </fieldset>

        <label className="field">
          <span>Notes</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Anything to remember?" />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {existing ? 'Save changes' : 'Hatch it!'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
