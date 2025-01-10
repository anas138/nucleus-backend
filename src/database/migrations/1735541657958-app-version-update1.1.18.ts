import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppVersionUpdate1735541657958 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.1.18" WHERE g.key = "app_version"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
