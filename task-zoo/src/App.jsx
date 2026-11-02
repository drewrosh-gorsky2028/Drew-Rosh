import { useEffect, useState } from 'react';
import { loadTasks, newTask, removeTask, saveTasks, toggleDone } from './lib/tasks.js';

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
  const [text, setText] = useState('');

  useEffect(() => saveTasks(tasks), [tasks]);

  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks((all) => [newTask(text), ...all]);
    setText('');
  };

  const toggle = (id) => setTasks((all) => toggleDone(all, id));
  const remove = (id) => setTasks((all) => removeTask(all, id));

  const open = tasks.filter((t) => !t.completedAt);
  const done = tasks
    .filter((t) => t.completedAt)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  return (
    <main className="page">
      <h1>To Do List</h1>

      <form className="add" onSubmit={add}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need to do?"
          aria-label="New task"
          maxLength={120}
        />
        <button type="submit">Add</button>
      </form>

      {open.length === 0 && done.length === 0 && (
        <p className="empty">Nothing to do yet. Add your first task above.</p>
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
