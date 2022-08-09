import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "../../common/entities/base.entity"
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    constructor(firstName: string, lastName: string, emailAddress: string) {
        super()
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

}
