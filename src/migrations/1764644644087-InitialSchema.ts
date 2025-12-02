import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1764644644087 implements MigrationInterface {
    name = 'InitialSchema1764644644087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_blog"."category" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_blog"."category" DROP COLUMN "description"`);
    }

}
