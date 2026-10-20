"use client";
import { useState, type FormEvent } from 'react';
import { CreateTaskSchema, TaskSchema, type Task } from '@repo/contracts';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  async function request(path: string, method: string, body: unknown) {
    const response = await fetch(`${API_URL}${path}`, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Could not save. Check the API connection and try again.');
    return TaskSchema.parse(await response.json());
  }
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = CreateTaskSchema.safeParse({ title });
    if (!result.success) { setError('Enter a title between 1 and 120 characters.'); return; }
    setBusy(true); setError(''); setStatus('');
    try {
      const task = await request('/tasks', 'POST', result.data);
      setTasks((current) => [...current, task]); setTitle(''); setStatus('Task added.');
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not save task.'); }
    finally { setBusy(false); }
  }
  async function toggle(task: Task) {
    setBusy(true); setError(''); setStatus('');
    try {
      const updated = await request(`/tasks/${task.id}`, 'PATCH', { isCompleted: !task.isCompleted });
      setTasks((current) => current.map((item) => item.id === updated.id ? updated : item));
      setStatus(updated.isCompleted ? 'Task completed.' : 'Task reopened.');
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not update task.'); }
    finally { setBusy(false); }
  }
  return <section aria-labelledby="tasks-title">
    <div className="section-heading"><h2 id="tasks-title">Your workspace</h2><span>{tasks.filter((task) => task.isCompleted).length} / {tasks.length} complete</span></div>
    <form onSubmit={add}><label htmlFor="title">What’s next?</label><div className="input-row"><input id="title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required placeholder="Give your next step a name" /><button disabled={busy} type="submit">{busy ? 'Saving…' : 'Add task + '}</button></div></form>
    {error && <p role="alert" className="error">{error}</p>}<p role="status" className="status">{status}</p>
    {tasks.length === 0 ? <p>No tasks yet. Add your first step above.</p> : <ul>{tasks.map((task) => <li key={task.id}><label className="task"><input type="checkbox" checked={task.isCompleted} disabled={busy} onChange={() => void toggle(task)} /><span className={task.isCompleted ? 'done' : ''}>{task.title}</span></label><span className="badge">{task.isCompleted ? 'Done' : 'In progress'}</span></li>)}</ul>}
  </section>;
}
