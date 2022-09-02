import { Injectable } from '@nestjs/common';
import { Repository, LessThan, Not, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  async create(description: string, currentUser: User) {
    const task = new Task(description, currentUser);
    const matchingTasks = await this.getByDescriptionAssignmentDateAndUser(task.description, task.assignmentDate, task.user);
    if (matchingTasks.length > 0) {
      throw new Error(`Duplicate task ${description} for user ${task.user.firstName} ${task.user.lastName} on same date ${task.assignmentDate} not allowed.`);
    }
    this.taskRepository.save(task);
    return task;
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async getAllActiveIncompleteBeforeToday(user: User): Promise<Task[]> {
    const startDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const results = this.taskRepository.find({
      where: {
        assignmentDate: LessThan(startDay),
        user: user,
        status: Not(In([TaskStatus.ARCHIVED, TaskStatus.COMPLETE]))
      },
    });
    return results;
  }

  findOne(id: string) {
    const taskToBeUpdated = Promise.resolve(
      this.taskRepository
        .findOne({
          where: [{ id: id }],
        })
        .then((x: Task) => x)
        .catch(() => {
          throw new Error(`Unable to find task with id: ${id}`);
        }),
    );
    return taskToBeUpdated;
  }

  async update(
    { id, description, assignmentDate, status, currentUser }: { id: string; description?: string; assignmentDate?: Date; status?: TaskStatus; currentUser: User; }) {
    const taskToBeUpdated = await Promise.resolve(this.findOne(id)).then(
      (x) => x,
    );
    taskToBeUpdated.assignmentDate = assignmentDate
      ? assignmentDate
      : taskToBeUpdated.assignmentDate;
    taskToBeUpdated.description = description
      ? description
      : taskToBeUpdated.description;
    taskToBeUpdated.status = status ? status : taskToBeUpdated.status;
    taskToBeUpdated.lastChangedBy = currentUser.id;
    taskToBeUpdated.lastChangedDateTime = new Date();
    this.taskRepository.save(taskToBeUpdated);
    return taskToBeUpdated;
  }

  async getAssignmentsForToday(): Promise<Task[]> {
    const startDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
    const results = this.taskRepository.find({
      where: {
        assignmentDate: startDay,
      },
    });
    return results;
  }

  getByDescriptionAssignmentDateAndUser(description: string, assignmentDate: Date, user: User): Promise<Task[]> {
    const results =
      this.taskRepository
        .find({
          where: {
            assignmentDate: assignmentDate,
            description: description,
            user: user
          },
        });
    return results;
  }
  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
