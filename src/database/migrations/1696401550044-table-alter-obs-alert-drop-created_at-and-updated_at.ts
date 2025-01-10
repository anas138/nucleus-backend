import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableAlterObsAlertDropCreatedAtAndUpdatedAt1696401550044
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE observium_alert
        DROP COLUMN created_at;
    `);
    await queryRunner.query(`
        ALTER TABLE observium_alert
        DROP COLUMN updated_at;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
