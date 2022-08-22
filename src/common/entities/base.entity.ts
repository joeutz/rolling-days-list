import { AutoMap } from '@automapper/classes';
import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    constructor(currentUserId: string) {
        this.createDateTime = new Date();
        this.lastChangedDateTime = new Date();
        this.createdBy = currentUserId;
        this.lastChangedBy = currentUserId;
    }

    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    @AutoMap()
    id: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    @AutoMap()
    createDateTime: Date;

    @Column({ type: 'varchar', length: 300 })
    @AutoMap()
    createdBy: string;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    @AutoMap()
    lastChangedDateTime: Date;

    @Column({ type: 'varchar', length: 300 })
    @AutoMap()
    lastChangedBy: string;
}