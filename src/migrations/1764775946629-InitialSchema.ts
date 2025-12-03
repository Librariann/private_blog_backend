import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1764775946629 implements MigrationInterface {
    name = 'InitialSchema1764775946629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_blog"."post" DROP COLUMN "featureYn"`);
        await queryRunner.query(`CREATE TYPE "private_blog"."post_featureyn_enum" AS ENUM('Y', 'N')`);
        await queryRunner.query(`ALTER TABLE "private_blog"."post" ADD "featureYn" "private_blog"."post_featureyn_enum" NOT NULL DEFAULT 'N'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_blog"."post" DROP COLUMN "featureYn"`);
        await queryRunner.query(`DROP TYPE "private_blog"."post_featureyn_enum"`);
        await queryRunner.query(`ALTER TABLE "private_blog"."post" ADD "featureYn" boolean NOT NULL DEFAULT false`);
    }

}
