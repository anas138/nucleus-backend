import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableModifyNceAlarmAddColumns1696506056015
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE nce_alarm
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    await queryRunner.query(`
        ALTER TABLE nce_alarm
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
