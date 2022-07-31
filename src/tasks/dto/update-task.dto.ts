import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  id: string;
  description?: string;
  assignmentDate?: Date;
  status?: TaskStatus;
}
