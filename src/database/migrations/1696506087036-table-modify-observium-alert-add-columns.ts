import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableModifyObserviumAlertAddColumns1696506087036
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE observium_alert
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    await queryRunner.query(`
        ALTER TABLE observium_alert
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
