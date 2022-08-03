import { AutoMap } from '@automapper/classes';
import { TaskStatus } from '../entities/task.entity';

export class TaskDto {
  @AutoMap()
  id: string;
  @AutoMap()
  description?: string;
  @AutoMap()
  assignmentDate?: Date;
  @AutoMap()
  status?: TaskStatus;
}
