import { MigrationInterface, QueryRunner } from "typeorm";

export class AppVersionUpdate1719906637875 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise < void> {
          await queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.1.3" WHERE g.key = "app_version"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
