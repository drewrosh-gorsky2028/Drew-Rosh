import { useEffect, useState } from 'react';
import { LISTS, loadTasks, newTask, removeTask, saveTasks, toggleDone } from './lib/tasks.js';

const TAB_KEY = 'to-do-list:tab';

function loadTab() {
  try {
    const tab = localStorage.getItem(TAB_KEY);
    return LISTS.some((l) => l.id === tab) ? tab : 'day';
  } catch {
    return 'day';
  }
}

function TaskRow({ task, onToggle, onRemove }) {
  const done = !!task.completedAt;
  return (
    <li className={`row ${done ? 'row--done' : ''}`}>
      <button
        className={`check ${done ? 'check--on' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={done ? `Mark “${task.title}” as not done` : `Finish “${task.title}”`}
      />
      <span className="row-title">{task.title}</span>
      <button className="remove" onClick={() => onRemove(task.id)} aria-label={`Delete “${task.title}”`}>
        ×
      </button>
    </li>
  );
}

export function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [tab, setTab] = useState(loadTab);
  const [text, setText] = useState('');

  useEffect(() => saveTasks(tasks), [tasks]);
  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, tab);
    } catch {
      // Not important if this can't be remembered.
    }
  }, [tab]);

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks((all) => [newTask(text, tab), ...all]);
    setText('');
  };

  const toggle = (id) => setTasks((all) => toggleDone(all, id));
  const remove = (id) => setTasks((all) => removeTask(all, id));

  const inList = tasks.filter((t) => t.list === tab);
  const open = inList.filter((t) => !t.completedAt);
  const done = inList
    .filter((t) => t.completedAt)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  const openCount = (id) => tasks.filter((t) => t.list === id && !t.completedAt).length;
  const current = LISTS.find((l) => l.id === tab);

  return (
    <main className="page">
      <h1>To Do List</h1>

      <div className="tabs" role="tablist" aria-label="Lists">
        {LISTS.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={tab === l.id}
            className={`tab ${tab === l.id ? 'tab--on' : ''}`}
            onClick={() => setTab(l.id)}
          >
            {l.name}
            {openCount(l.id) > 0 && <span className="count">{openCount(l.id)}</span>}
          </button>
        ))}
      </div>

      <form className="add" onSubmit={add}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Add to ${current.name.toLowerCase()}…`}
          aria-label={`New task for ${current.name}`}
          maxLength={120}
        />
        <button type="submit">Add</button>
      </form>

      {open.length === 0 && done.length === 0 && (
        <p className="empty">Nothing here yet. Add your first task above.</p>
      )}

      <ul className="list">
        {open.map((t) => (
          <TaskRow key={t.id} task={t} onToggle={toggle} onRemove={remove} />
        ))}
      </ul>

      {done.length > 0 && (
        <>
          <h2>Done</h2>
          <ul className="list">
            {done.map((t) => (
              <TaskRow key={t.id} task={t} onToggle={toggle} onRemove={remove} />
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
