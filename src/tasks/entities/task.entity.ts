import { AutoMap } from '@automapper/classes';
import { User } from '../../users/entities/user.entity'
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from "../../common/entities/base.entity"

export enum TaskStatus {
  TODO = 'to do',
  INPROGRESS = 'in progress',
  COMPLETE = 'complete',
  ARCHIVED = 'archived'
}

@Entity()
export class Task extends BaseEntity {
  constructor(description: string, currentUser: User) {
    const currentUserId = currentUser ? currentUser.id : 'System';
    super(currentUserId)
    this.description = description;
    this.assignmentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    this.status = TaskStatus.TODO;
    this.user = currentUser;
  }

  @Column()
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  assignmentDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @AutoMap()
  status: TaskStatus;

  @ManyToOne(() => User, (user: User) => user.tasks)
  user: User;
}
