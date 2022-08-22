import { Controller, Post, Body, Param, Patch, Get, UseGuards, Req, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RequestUser } from '../common/interceptor/user-decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @RequestUser() user: User): Promise<Task> {
    return await this.tasksService.create(createTaskDto.description, user);
  }

  // @Get()
  // findAll() {
  //   return this.tasksService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tasksService.findOne(+id);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: TaskDto, @RequestUser() user: User) {
    const assignmentDate = updateTaskDto.assignmentDate
      ? new Date(new Date(updateTaskDto.assignmentDate).setUTCHours(0, 0, 0, 0))
      : undefined;
    try {
      return this.tasksService.update(
        { id, description: updateTaskDto.description, assignmentDate, status: updateTaskDto.status, currentUser: user });
    } catch (e) {
      return 'error';
    }
  }

  @Get('today')
  async getAssignmentsForToday(@RequestUser() user: User): Promise<TaskDto[]> {
    const tasksForToday = await this.tasksService.getAssignmentsForToday();
    return tasksForToday;
  }

  @Get()
  async findAll(@RequestUser() user: User): Promise<TaskDto[]> {
    const tasks = this.tasksService.findAll();
    return tasks;
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }
}
