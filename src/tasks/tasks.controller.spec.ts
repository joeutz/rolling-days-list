import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const currentUser = new User('first', 'last', 'first@last.com');
const mockTask = new Task('test', currentUser);
describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  const mockJwtService = {};
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
        { provide: JwtService, useValue: mockJwtService }
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service create method', async () => {
    const mockTask = new Task('test', currentUser);
    const spy = jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(mockTask));
    const createTaskDto = { description: 'test' };
    const newTask = await controller.create(createTaskDto, currentUser);
    expect(newTask.status).toBe(TaskStatus.TODO);
    expect(spy).toBeCalledTimes(1);
  });
  it('should call the service update method', () => {
    const updateTaskDto = {
      id: '1',
      description: 'test',
      assignment_date: new Date(),
      status: TaskStatus.TODO,
    };
    const spy = jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve(new Task('test', currentUser)));
    controller.update(updateTaskDto.id, updateTaskDto, currentUser);
    expect(spy).toBeCalledTimes(1);
  });
  it('can get assignments for today', () => {
    const spy = jest
      .spyOn(service, 'getAssignmentsForToday')
      .mockReturnValue(Promise.resolve([]));
    controller.getAssignmentsForToday(currentUser);
    expect(spy).toBeCalledTimes(1);
  });
});
