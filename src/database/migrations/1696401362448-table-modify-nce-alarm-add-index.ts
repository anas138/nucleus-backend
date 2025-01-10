import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableModifyNceAlarmAddIndex1696401362448
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX idx_created_on ON nce_alarm (created_on)
    `);
    await queryRunner.query(`
        CREATE INDEX idx_cleared_on ON nce_alarm (cleared_on)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
