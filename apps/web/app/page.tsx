import { getTasks } from '../lib/api';
import { TaskBoard } from './task-board';
export const dynamic = 'force-dynamic';
export default async function HomePage() {
  let tasks;
  try { tasks = await getTasks(); } catch {
    return <main><p className="eyebrow">TASK LAB / CONNECTION</p><h1>Let’s get connected.</h1><p role="alert">Unable to load tasks. Start the NestJS API, then try again.</p><a href="/">Retry connection →</a></main>;
  }
  return <main><header><p className="eyebrow">NEXT.JS + NESTJS / TYPESCRIPT LAB</p><h1>Small tasks.<br /><span>Full-stack thinking.</span></h1><p className="intro">One shared contract. Two applications. A little progress, every day.</p></header><TaskBoard initialTasks={tasks} /><footer>Built to learn. Data resets when the API restarts.</footer></main>;
}
