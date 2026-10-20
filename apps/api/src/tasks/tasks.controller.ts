import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTaskSchema, UpdateTaskSchema, type Task } from '@repo/contracts';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Get()
  findAll(): Task[] { return this.tasksService.findAll(); }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Task { return this.tasksService.findOne(id); }
  @Post()
  create(@Body() body: unknown): Task {
    const result = CreateTaskSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.issues);
    return this.tasksService.create(result.data);
  }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown): Task {
    const result = UpdateTaskSchema.safeParse(body);
    if (!result.success) throw new BadRequestException(result.error.issues);
    return this.tasksService.update(id, result.data);
  }
}
