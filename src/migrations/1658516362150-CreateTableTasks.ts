import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTasks1658516362150 implements MigrationInterface {
    name = 'CreateTableTasks1658516362150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('active', 'complete')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "assignmentDate" TIMESTAMP NOT NULL, "status" "public"."task_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    }

}
