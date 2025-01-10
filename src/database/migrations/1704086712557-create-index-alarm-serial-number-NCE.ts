import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexAlarmSerialNumberNCE1704086712557
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IDX_ALARM_SERIAL_NUMBER ON nce_alarm(alarm_serial_number)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IDX_ALARM_SERIAL_NUMBER`);
  }
}
