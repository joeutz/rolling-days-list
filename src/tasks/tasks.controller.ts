import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto.description);
  }

  // @Get()
  // findAll() {
  //   return this.tasksService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tasksService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: TaskDto) {
    return this.tasksService.update(
      id,
      updateTaskDto.description,
      updateTaskDto.assignmentDate,
      updateTaskDto.status,
    );
  }

  @Get('today')
  async getAssignmentsForToday(): Promise<TaskDto[]> {
    const tasksForToday = await this.tasksService.getAssignmentsForToday();
    console.log(tasksForToday);
    return tasksForToday;
  }

  @Get()
  async findAll(): Promise<TaskDto[]> {
    const tasks = this.tasksService.findAll();
    console.log(tasks);
    return tasks;
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }
}
