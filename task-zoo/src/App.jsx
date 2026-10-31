import { useCallback, useState } from 'react';
import { useZoo } from './state/ZooContext.jsx';
import { Header } from './components/Header.jsx';
import { Nursery } from './components/Nursery.jsx';
import { Zoo } from './components/Zoo.jsx';
import { TaskList } from './components/TaskList.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { AnimalCard } from './components/AnimalCard.jsx';
import { CategoryManager } from './components/CategoryManager.jsx';
import { Shop } from './components/Shop.jsx';
import { Celebration } from './components/Celebration.jsx';
import { Icon } from './components/ui/Icon.jsx';

const TABS = [
  { id: 'nursery', label: 'Nursery', icon: 'egg' },
  { id: 'zoo', label: 'Zoo', icon: 'zoo' },
  { id: 'list', label: 'List', icon: 'list' },
];

export function App() {
  const { state, dispatch } = useZoo();
  // Which section shows on phones (desktop shows everything side by side).
  const [view, setView] = useState('nursery');
  // { type: 'form' | 'card' | 'categories' | 'shop', taskId? }
  const [modal, setModal] = useState(null);
  const [celebrating, setCelebrating] = useState(null);
  const [decorating, setDecorating] = useState(false);

  const close = useCallback(() => setModal(null), []);
  const openTask = useCallback((id) => setModal({ type: 'card', taskId: id }), []);
  const addTask = useCallback(() => setModal({ type: 'form' }), []);
  const openShop = useCallback(() => setModal({ type: 'shop' }), []);

  const complete = useCallback(
    (id) => {
      dispatch({ type: 'COMPLETE_TASK', id });
      setModal(null);
      setCelebrating(id);
    },
    [dispatch],
  );

  const endCelebration = useCallback(() => setCelebrating(null), []);

  const visitZoo = (taskId) => {
    const task = state.tasks.find((t) => t.id === taskId);
    setCelebrating(null);
    setView('zoo');
    requestAnimationFrame(() =>
      document.getElementById(`habitat-${task?.categoryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
  };

  return (
    <div className="app">
      <Header onOpenShop={openShop} onOpenCategories={() => setModal({ type: 'categories' })} />

      <main className={`layout view-${view}`}>
        <div className="layout-main">
          <div className="panel panel--nursery">
            <Nursery onOpenTask={openTask} onAddTask={addTask} />
          </div>
          <div className="panel panel--zoo">
            <Zoo onOpenTask={openTask} onOpenShop={openShop} decorating={decorating} setDecorating={setDecorating} />
          </div>
        </div>
        <aside className="panel panel--list">
          <TaskList onOpenTask={openTask} onComplete={complete} onAddTask={addTask} />
        </aside>
      </main>

      <button className="fab" onClick={addTask} aria-label="Add a task">
        <Icon name="plus" size={28} />
      </button>

      <nav className="tabbar" aria-label="Sections">
        {TABS.map((t) => (
          <button key={t.id} className={view === t.id ? 'is-active' : ''} onClick={() => setView(t.id)} aria-current={view === t.id}>
            <Icon name={t.icon} size={22} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {modal?.type === 'form' && (
        <TaskForm
          taskId={modal.taskId}
          onClose={close}
          onSaved={(id) => {
            setModal(modal.taskId ? { type: 'card', taskId: id } : null);
            if (!modal.taskId) setView((v) => (v === 'zoo' ? 'nursery' : v));
          }}
        />
      )}
      {modal?.type === 'card' && (
        <AnimalCard
          taskId={modal.taskId}
          onClose={close}
          onEdit={(id) => setModal({ type: 'form', taskId: id })}
          onComplete={complete}
        />
      )}
      {modal?.type === 'categories' && <CategoryManager onClose={close} />}
      {modal?.type === 'shop' && (
        <Shop
          onClose={close}
          onDecorate={() => {
            setModal(null);
            setDecorating(true);
            setView('zoo');
          }}
        />
      )}
      {celebrating && <Celebration taskId={celebrating} onClose={endCelebration} onVisit={() => visitZoo(celebrating)} />}
    </div>
  );
}
