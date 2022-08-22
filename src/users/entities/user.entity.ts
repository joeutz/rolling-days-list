import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../../common/entities/base.entity"
import { Column, Entity, OneToMany } from "typeorm";
import { Task } from "../../tasks/entities/task.entity";

@Entity()
export class User extends BaseEntity {
    constructor(firstName: string, lastName: string, emailAddress: string) {
        super("System User")
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
    }
    @Column()
    @AutoMap()
    firstName: string;
    @Column()
    @AutoMap()
    lastName: string;
    @Column()
    @AutoMap()
    emailAddress: string;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}
