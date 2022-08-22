import { Test, TestingModule } from '@nestjs/testing';
import { Task, TaskStatus } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

describe('TasksService', () => {
  let service: TasksService;
  let repo: Repository<Task>;
  const currentUser = new User('first', 'last', 'first@last.com');
  const taskToBeTested = new Task('test', currentUser);
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

  it('should add with today as assignment_date and status = active', async () => {
    const spy = jest.spyOn(repo, 'save').mockImplementation();
    const findSpy = jest
      .spyOn(repo, 'find')
      .mockReturnValueOnce(Promise.resolve([]));
    const newTask = await service.create("test", currentUser);
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
    const newTask = taskToBeTested;
    newTask.assignmentDate = new Date();
    newTask.id = 'AN_UUID';
    const findSpy = jest
      .spyOn(repo, 'findOne')
      .mockReturnValueOnce(Promise.resolve(newTask));
    const updatedTask = await service.update(
      { id: newTask.id, description: 'updated description', assignmentDate, status: newTask.status, currentUser },
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
    const newTask = taskToBeTested;
    newTask.assignmentDate = assignmentDate;
    newTask.id = '1UUID';
    const findSpy = jest
      .spyOn(repo, 'findOne')
      .mockReturnValue(Promise.resolve(newTask));

    const updatedTask = await service.update(
      { id: newTask.id, description: 'updated description', assignmentDate: undefined, status: newTask.status, currentUser },
    );
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: [{ id: newTask.id }],
    });
    expect(updatedTask.description).toBe('updated description');
    expect(updatedTask.assignmentDate).toBe(assignmentDate);
    const updatedAssignmentDate = new Date('3/2/2022');
    const updatedTask2 = await service.update(
      { id: newTask.id, description: 'updated description', assignmentDate: updatedAssignmentDate, status: newTask.status, currentUser },
    );
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: [{ id: newTask.id }],
    });
    expect(updatedTask2.description).toBe('updated description');
    expect(updatedTask2.assignmentDate).toBe(updatedAssignmentDate);
    expect(updatedTask2.status).toBe(TaskStatus.ACTIVE);

    const updatedTask3 = await service.update(
      { id: newTask.id, description: 'updated description', currentUser },
    );
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: [{ id: newTask.id }],
    });
    expect(updatedTask3.description).toBe('updated description');
    expect(updatedTask3.assignmentDate).toBe(updatedAssignmentDate);
    expect(updatedTask3.status).toBe(TaskStatus.ACTIVE);
  });
  it('get assignments for today runs query from beginning of day to end of day', async () => {
    //create mock return and create spy that validates the start/end dates passed to the task repository
    const findSpy = jest.spyOn(repo, 'find').mockResolvedValue([]);
    const startDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const results = service.getAssignmentsForToday();
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: {
        assignmentDate: startDay,
      },
    });
    expect(await Promise.resolve(results)).toStrictEqual([]);
  });
  it('has user for task', () => {
    const currentUser = new User('first', 'last', 'first@last.com');
    jest.spyOn(repo, 'save').mockImplementation();
    const assignmentDate = new Date('02/02/2022');
    const newTask = new Task('test', currentUser);
    expect(newTask.user).toBe(currentUser);
  })
  it('has a unique description for a task by user and assignment date', async () => {
    const currentUser = new User('first', 'last', 'first@last.com');
    jest.spyOn(repo, 'save').mockImplementation();
    let findSpy = jest
      .spyOn(repo, 'find')
      .mockReturnValueOnce(Promise.resolve([]));
    const initialTask = await service.create('test', currentUser);
    findSpy = jest
      .spyOn(repo, 'find')
      .mockReturnValueOnce(Promise.resolve([initialTask]));
    expect(initialTask).toBeDefined();
    const startDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledWith({
      where: {
        assignmentDate: startDay,
        description: 'test',
        user: currentUser
      },
    });
  })
});
