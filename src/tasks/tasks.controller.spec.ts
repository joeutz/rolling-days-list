import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
const mockTask = new Task('test');
describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((desc: string) => Promise.resolve(mockTask)),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service create method', () => {
    const spy = jest.spyOn(service, 'create').mockReturnValue(new Task('test'));
    const createTaskDto = { description: 'test' };
    const newTask = controller.create(createTaskDto);
    expect(newTask.status).toBe(TaskStatus.ACTIVE);
    expect(spy).toBeCalledTimes(1);
  });
  it('should call the service update method', () => {
    const updateTaskDto = {
      id: '1',
      description: 'test',
      assignment_date: new Date(),
      status: TaskStatus.ACTIVE,
    };
    const spy = jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve(new Task('test')));
    controller.update(updateTaskDto.id, updateTaskDto);
    expect(spy).toBeCalledTimes(1);
  });
  it('can get assignments for today', () => {
    const spy = jest
      .spyOn(service, 'getAssignmentsForToday')
      .mockReturnValue(Promise.resolve([]));
    controller.getAssignmentsForToday();
    expect(spy).toBeCalledTimes(1);
  });
});
