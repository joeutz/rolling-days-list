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

  // findAll() {
  //   return `This action returns all tasks`;
  // }

  findOne(id: number) {
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
    id: number,
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

    return taskToBeUpdated;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
