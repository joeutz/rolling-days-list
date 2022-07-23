import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

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

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  // update(id: number, description?: string) {
  //   return `This action updates a #${id} task with description of ${description}`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
