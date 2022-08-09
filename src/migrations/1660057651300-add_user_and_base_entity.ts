import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserAndBaseEntity1660057651300 implements MigrationInterface {
    name = 'addUserAndBaseEntity1660057651300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300) NOT NULL, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300) NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "emailAddress" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD "createdBy" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD "lastChangedBy" character varying(300) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "lastChangedBy"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "lastChangedDateTime"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createDateTime"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
