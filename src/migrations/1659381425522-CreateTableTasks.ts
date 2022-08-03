import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTasks1659381425522 implements MigrationInterface {
  name = 'CreateTableTasks1659381425522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "assignmentDate" TIMESTAMP NOT NULL, "status" "public"."task_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
