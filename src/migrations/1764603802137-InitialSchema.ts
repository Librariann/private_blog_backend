import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1764603802137 implements MigrationInterface {
    name = 'InitialSchema1764603802137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" DROP COLUMN "commentPassword"`);
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" ADD "annonymousId" character varying`);
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" ADD "annonymousPassword" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" DROP COLUMN "annonymousPassword"`);
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" DROP COLUMN "annonymousId"`);
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" ADD "commentPassword" character varying`);
        await queryRunner.query(`ALTER TABLE "private_blog"."comment" ADD "commentId" character varying`);
    }

}
