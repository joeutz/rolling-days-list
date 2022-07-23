import { Test, TestingModule } from '@nestjs/testing';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let repo: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add with today as assignment_date and status = active', () => {
    const spy = jest.spyOn(repo, 'save').mockImplementation();
    const newTask = service.create('test');
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
    expect(spy).toBeCalledTimes(1);
  });
});
