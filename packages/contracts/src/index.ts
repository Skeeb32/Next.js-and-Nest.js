import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(120),
  isCompleted: z.boolean(),
});
export const TasksSchema = z.array(TaskSchema);
export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Enter a task title.').max(120),
}).strict();
export const UpdateTaskSchema = z.object({ isCompleted: z.boolean() }).strict();
export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
