import { Controller, Post, Body, Param, Patch, Get, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskDto } from './dto/task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { RequestUser } from 'src/common/interceptor/user-decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
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
  async getAssignmentsForToday(@RequestUser() user: User): Promise<TaskDto[]> {
    console.log(user);
    // const decodedJwtAccessToken: JwtPayload = this.jwtService.decode(signedJwtAccessToken);
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
