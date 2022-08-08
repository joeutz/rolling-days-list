import { AutoMap } from "@automapper/classes";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    constructor(firstName: string, lastName: string, emailAddress: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
    }


    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    @AutoMap()
    id: string;

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
