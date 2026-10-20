import { TasksSchema } from '@repo/contracts';
export async function getTasks() {
  const response = await fetch(`${process.env.API_URL ?? 'http://localhost:4000'}/tasks`, {
    cache: 'no-store', signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return TasksSchema.parse(await response.json());
}
