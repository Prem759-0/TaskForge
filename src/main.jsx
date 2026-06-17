import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, BarChart3, CalendarDays, CheckCircle2, Copy, LogOut, Moon, Plus, Search, ShieldCheck, Sparkles, Sun, Trash2 } from 'lucide-react';
import './styles.css';

const statuses = ['Backlog', 'Todo', 'In Progress', 'Review', 'Completed'];
const boardStatuses = ['Todo', 'In Progress', 'Review', 'Completed'];
const priorities = ['Critical', 'High', 'Medium', 'Low'];
const categories = ['Coding', 'Study', 'Startup', 'Health', 'Personal', 'Finance', 'Custom'];
const today = new Date('2026-06-17');
const initialTasks = [
  { id: 1, title: 'Ship Product Hunt launch plan', description: 'Finalize positioning, demo GIFs, and maker comment.', dueDate: '2026-06-20', priority: 'Critical', category: 'Startup', tags: ['launch', 'growth'], estimatedMinutes: 120, status: 'In Progress', archived: false },
  { id: 2, title: 'Build auth middleware tests', description: 'Cover invalid token, expired token, and happy path.', dueDate: '2026-06-18', priority: 'High', category: 'Coding', tags: ['api', 'security'], estimatedMinutes: 75, status: 'Todo', archived: false },
  { id: 3, title: 'Study distributed systems notes', description: 'Summarize consistency models for interview prep.', dueDate: '2026-06-22', priority: 'Medium', category: 'Study', tags: ['learning'], estimatedMinutes: 60, status: 'Backlog', archived: false },
  { id: 4, title: 'Review freelance invoices', description: 'Confirm payments, tax category, and next billing dates.', dueDate: '2026-06-25', priority: 'High', category: 'Finance', tags: ['money'], estimatedMinutes: 45, status: 'Review', archived: false },
  { id: 5, title: 'Morning strength session', description: 'Lower body workout and mobility cooldown.', dueDate: '2026-06-17', priority: 'Low', category: 'Health', tags: ['streak'], estimatedMinutes: 40, status: 'Completed', archived: false }
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [active, setActive] = useState(initialTasks[0]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState({ name: 'Alex Founder', email: 'alex@taskforge.dev' });

  const visible = useMemo(() => {
    const rank = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return tasks
      .filter(task => !task.archived)
      .filter(task => filter === 'All' || task.status === filter || task.category === filter || task.priority === filter || task.tags.includes(filter))
      .filter(task => `${task.title} ${task.description} ${task.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sort === 'Due Date') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sort === 'Priority') return rank[a.priority] - rank[b.priority];
        if (sort === 'Completion') return Number(b.status === 'Completed') - Number(a.status === 'Completed');
        if (sort === 'Oldest') return a.id - b.id;
        return b.id - a.id;
      });
  }, [tasks, query, filter, sort]);

  const completed = tasks.filter(task => task.status === 'Completed' && !task.archived).length;
  const open = tasks.filter(task => task.status !== 'Completed' && !task.archived).length;
  const completionRate = Math.round((completed / Math.max(1, completed + open)) * 100);
  const weekly = [4, 6, 3, 8, 5, 9, completed + 2];
  const productivityScore = Math.min(100, completionRate + weekly.filter(Boolean).length * 4);
  const achievements = ['First Sprint', '8 Day Streak', 'Deep Work Hero'];

  const updateTask = (id, patch) => {
    setTasks(current => current.map(task => task.id === id ? { ...task, ...patch } : task));
    setActive(current => current?.id === id ? { ...current, ...patch } : current);
  };
  const addTask = () => {
    const task = { id: Date.now(), title: 'New execution sprint', description: 'Clarify the outcome, scope, and next action.', dueDate: '2026-06-30', priority: 'Medium', category: 'Personal', tags: ['focus'], estimatedMinutes: 30, status: 'Todo', archived: false };
    setTasks(current => [task, ...current]);
    setActive(task);
  };
  const duplicateTask = task => setTasks(current => [{ ...task, id: Date.now(), title: `${task.title} Copy`, status: 'Todo' }, ...current]);
  const deleteTask = id => setTasks(current => current.filter(task => task.id !== id));

  return <main className={theme}>
    <a className="skip" href="#workspace">Skip to workspace</a>
    <nav className="topbar" aria-label="Primary navigation">
      <div className="brand"><span>TF</span><div><strong>TaskForge</strong><small>Build. Focus. Execute.</small></div></div>
      <div className="nav-actions"><button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle color theme">{theme === 'light' ? <Moon/> : <Sun/>} {theme}</button><button onClick={() => setUser(null)}><LogOut/> Logout</button></div>
    </nav>

    <section className="hero">
      <motion.div className="hero-copy" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <p className="eyebrow"><Sparkles/> Premium productivity OS</p>
        <h1>Forge chaos into focused execution.</h1>
        <p>TaskForge combines command-center planning, analytics, goals, streaks, and a tactile Kanban workflow for ambitious makers.</p>
        <div className="hero-actions"><button onClick={addTask}><Plus/> Create task</button><button className="secondary"><BarChart3/> View analytics</button></div>
      </motion.div>
      <aside className="score-card" aria-label="Productivity score"><span>Productivity Score</span><strong>{productivityScore}</strong><p>{completed} completed • {open} pending • {completionRate}% completion</p></aside>
      <form className="auth-card" onSubmit={event => { event.preventDefault(); setUser({ name: event.currentTarget.name.value || 'TaskForger', email: event.currentTarget.email.value }); }}>
        <h2>{authMode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
        <p><ShieldCheck/> Protected routes ready for JWT auth.</p>
        {authMode === 'signup' && <input name="name" aria-label="Name" placeholder="Name" />}
        <input name="email" type="email" aria-label="Email" placeholder="Email" defaultValue={user?.email || ''} />
        <input name="password" type="password" aria-label="Password" placeholder="Password" />
        <button>{authMode === 'signin' ? 'Sign in' : 'Sign up'}</button>
        <button type="button" className="text-button" onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}>{authMode === 'signin' ? 'Need an account?' : 'Already have an account?'}</button>
      </form>
    </section>

    <section className="stats" aria-label="Dashboard metrics">
      {[
        ['Total Tasks', tasks.filter(task => !task.archived).length, '#FFD23F'],
        ['Completed Tasks', completed, '#6BCB77'],
        ['Pending Tasks', open, '#4D96FF'],
        ['Weekly Progress', weekly.reduce((sum, day) => sum + day, 0), '#FF6B6B'],
        ['Completion Rate', `${completionRate}%`, '#FFD23F']
      ].map(([label, value, color]) => <article style={{ '--accent': color }} key={label}><span>{label}</span><strong>{value}</strong></article>)}
    </section>

    <section className="analytics-grid" aria-label="Analytics">
      <article><h2>Weekly trend</h2><div className="bars">{weekly.map((day, index) => <span key={index} style={{ height: `${day * 9}px` }}>{day}</span>)}</div></article>
      <article><h2>Category distribution</h2>{categories.slice(0, 6).map(category => <p className="distribution" key={category}><b>{category}</b><span style={{ width: `${20 + tasks.filter(task => task.category === category).length * 18}%` }} /></p>)}</article>
      <article><h2>Achievements</h2><div className="badges">{achievements.map(item => <span key={item}>🏆 {item}</span>)}</div></article>
    </section>

    <section className="workspace" id="workspace">
      <aside className="panel" aria-label="Search, filters, and sorting">
        <label><Search/> Global search<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search titles, tags, notes" /></label>
        <label>Sort tasks<select value={sort} onChange={event => setSort(event.target.value)}>{['Newest', 'Oldest', 'Due Date', 'Priority', 'Completion'].map(option => <option key={option}>{option}</option>)}</select></label>
        <h3>Filters</h3>{['All', ...statuses, ...priorities, ...categories, 'launch', 'api', 'focus'].map(item => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}
        <div className="goals"><h3>Goals & streaks</h3><p>Daily 3 / Weekly 15 / Monthly 60</p><strong>🔥 8 day streak</strong></div>
      </aside>

      <div className="board" aria-label="Kanban board">{boardStatuses.map(status => <section className="column" key={status}><h2>{status}</h2><AnimatePresence>{visible.filter(task => task.status === status).map(task => <TaskCard key={task.id} task={task} onOpen={setActive} onUpdate={updateTask} onDuplicate={duplicateTask} onDelete={deleteTask} />)}</AnimatePresence></section>)}</div>

      <aside className="details" aria-label="Task details side panel">
        <h2>Task Details</h2>{active && <TaskDetails task={active} onUpdate={updateTask} />}
      </aside>
    </section>
  </main>;
}

function TaskCard({ task, onOpen, onUpdate, onDuplicate, onDelete }) {
  return <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} draggable onClick={() => onOpen(task)} className={`task ${task.priority.toLowerCase()}`}>
    <div><b>{task.title}</b><span>{task.priority}</span></div>
    <p>{task.description}</p>
    <small><CalendarDays size={16}/> {task.dueDate} • {task.category} • {task.estimatedMinutes}m</small>
    <footer>{task.tags.map(tag => <em key={tag}>#{tag}</em>)}<button aria-label="Duplicate task" onClick={event => { event.stopPropagation(); onDuplicate(task); }}><Copy size={16}/></button><button aria-label="Archive task" onClick={event => { event.stopPropagation(); onUpdate(task.id, { archived: true }); }}><Archive size={16}/></button><button aria-label="Delete task" onClick={event => { event.stopPropagation(); onDelete(task.id); }}><Trash2 size={16}/></button><button aria-label="Complete task" onClick={event => { event.stopPropagation(); onUpdate(task.id, { status: 'Completed' }); }}><CheckCircle2 size={16}/></button></footer>
  </motion.article>;
}

function TaskDetails({ task, onUpdate }) {
  const daysLeft = Math.ceil((new Date(task.dueDate) - today) / 86400000);
  return <div className="detail-form">
    <label>Title<input value={task.title} onChange={event => onUpdate(task.id, { title: event.target.value })} /></label>
    <label>Description<textarea value={task.description} onChange={event => onUpdate(task.id, { description: event.target.value })} /></label>
    <label>Status<select value={task.status} onChange={event => onUpdate(task.id, { status: event.target.value })}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
    <label>Priority<select value={task.priority} onChange={event => onUpdate(task.id, { priority: event.target.value })}>{priorities.map(priority => <option key={priority}>{priority}</option>)}</select></label>
    <label>Due date<input type="date" value={task.dueDate} onChange={event => onUpdate(task.id, { dueDate: event.target.value })} /></label>
    <p className="calendar"><b>Monthly Calendar</b><span>{task.dueDate} • {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}</span></p>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
