import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from "../../common/entities/base.entity"

export enum TaskStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
}

@Entity()
export class Task extends BaseEntity {
  constructor(description: string) {
    super()
    this.description = description;
    this.assignmentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    this.status = TaskStatus.ACTIVE;
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
    default: TaskStatus.ACTIVE,
  })
  @AutoMap()
  status: TaskStatus;
}
