import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  create(description: string) {
    const task = new Task(description);
    this.taskRepository.save(task);
    return task;
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
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
    id: string,
    description?: string,
    assignmentDate?: Date,
    status?: TaskStatus,
  ) {
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
  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
