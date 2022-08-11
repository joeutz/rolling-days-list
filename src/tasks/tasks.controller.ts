import { Controller, Post, Body, Param, Patch, Get, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

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
    const assignmentDate = updateTaskDto.assignmentDate
      ? new Date(new Date(updateTaskDto.assignmentDate).setUTCHours(0, 0, 0, 0))
      : undefined;
    try {
      return this.tasksService.update(
        id,
        updateTaskDto.description,
        assignmentDate,
        updateTaskDto.status,
      );
    } catch (e) {
      return 'error';
    }
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  async getAssignmentsForToday(): Promise<TaskDto[]> {
    const tasksForToday = await this.tasksService.getAssignmentsForToday();
    return tasksForToday;
  }

  @Get()
  async findAll(): Promise<TaskDto[]> {
    const tasks = this.tasksService.findAll();
    return tasks;
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }
}
