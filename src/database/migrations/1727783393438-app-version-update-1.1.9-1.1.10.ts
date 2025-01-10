import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppVersionUpdate1727783393438 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.1.9" WHERE g.key = "app_version"
        `);

    await queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.1.10" WHERE g.key = "app_version"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
