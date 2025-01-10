import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableModifyNceAlarmAddIndex1696938625285
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX idx_severity ON nce_alarm (severity)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
