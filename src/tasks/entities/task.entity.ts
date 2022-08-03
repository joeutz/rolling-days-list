import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
}

@Entity()
export class Task {
  constructor(description: string) {
    this.description = description;
    this.assignmentDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    this.status = TaskStatus.ACTIVE;
  }

  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @AutoMap()
  id: string;

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
