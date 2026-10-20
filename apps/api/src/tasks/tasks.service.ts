import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateTaskInput, Task, UpdateTaskInput } from '@repo/contracts';

@Injectable()
export class TasksService {
  private nextId = 3;
  private readonly tasks: Task[] = [
    { id: 1, title: 'Build the Next.js frontend', isCompleted: false },
    { id: 2, title: 'Create the NestJS API', isCompleted: true },
  ];
  findAll(): Task[] { return this.tasks; }
  findOne(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }
  create(input: CreateTaskInput): Task {
    const task = { id: this.nextId++, title: input.title, isCompleted: false };
    this.tasks.push(task);
    return task;
  }
  update(id: number, input: UpdateTaskInput): Task {
    const task = this.findOne(id);
    task.isCompleted = input.isCompleted;
    return task;
  }
}
