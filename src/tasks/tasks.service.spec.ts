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
  it('should be able to edit the task', async () => {
    jest.spyOn(repo, 'save').mockImplementation();
    const assignmentDate = new Date('02/02/2022');
    const newTask = new Task('test');
    newTask.assignmentDate = new Date();
    newTask.id = 1;
    const findSpy = jest
      .spyOn(repo, 'findOne')
      .mockReturnValueOnce(Promise.resolve(newTask));
    const updatedTask = await service.update(
      newTask.id,
      'updated description',
      assignmentDate,
      newTask.status,
    );
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: [{ id: newTask.id }],
    });
    expect(updatedTask.description).toBe('updated description');
    expect(updatedTask.assignmentDate).toBe(assignmentDate);
  });
  it('sending null to update for date leaves date the same as before', async () => {
    jest.spyOn(repo, 'save').mockImplementation();
    const assignmentDate = new Date('02/02/2022');
    const newTask = new Task('test');
    newTask.assignmentDate = assignmentDate;
    newTask.id = 1;
    const findSpy = jest
      .spyOn(repo, 'findOne')
      .mockReturnValue(Promise.resolve(newTask));

    const updatedTask = await service.update(
      newTask.id,
      'updated description',
      undefined,
      newTask.status,
    );
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: [{ id: newTask.id }],
    });
    expect(updatedTask.description).toBe('updated description');
    expect(updatedTask.assignmentDate).toBe(assignmentDate);
    const updatedAssignmentDate = new Date('3/2/2022');
    const updatedTask2 = await service.update(
      newTask.id,
      'updated description',
      updatedAssignmentDate,
      newTask.status,
    );
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: [{ id: newTask.id }],
    });
    expect(updatedTask2.description).toBe('updated description');
    expect(updatedTask2.assignmentDate).toBe(updatedAssignmentDate);
    expect(updatedTask2.status).toBe(TaskStatus.ACTIVE);

    const updatedTask3 = await service.update(
      newTask.id,
      'updated description',
    );
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: [{ id: newTask.id }],
    });
    expect(updatedTask3.description).toBe('updated description');
    expect(updatedTask3.assignmentDate).toBe(updatedAssignmentDate);
    expect(updatedTask3.status).toBe(TaskStatus.ACTIVE);
  });
});
