import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAppVersion1716964223261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.1.1" WHERE g.key = "app_version"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
