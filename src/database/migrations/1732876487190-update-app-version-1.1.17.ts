import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAppVersion1732876487190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.1.17" WHERE g.key = "app_version"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}