import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppVersionUpdate1705995675191 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        UPDATE global_settings g
        SET g.value = "1.0.11" WHERE g.key = "app_version"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
