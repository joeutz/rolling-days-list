import { Test, TestingModule } from '@nestjs/testing';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add with today as assignment_date and status = active', () => {
    const createTaskDto = { description: 'test' };
    const newTask = controller.create(createTaskDto);
    expect(newTask.description).toBe('test');
    const currentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    expect(
      newTask.assignmentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    ).toBe(
      currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    );
    expect(newTask.status).toBe(TaskStatus.ACTIVE);
  });
});
