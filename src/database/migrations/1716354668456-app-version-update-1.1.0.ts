import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppVersionUpdate1716354668456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.1.0" WHERE g.key = "app_version"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
