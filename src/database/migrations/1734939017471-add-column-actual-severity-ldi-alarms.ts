import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnActualSeverityLdiAlarms1734939017471
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
         ALTER TABLE ldi_softswitch_ems_alarm
ADD COLUMN actual_severity VARCHAR(50) DEFAULT NULL AFTER severity;
    `);

    await queryRunner.query(`
        UPDATE ldi_softswitch_ems_alarm ld
        SET ld.actual_severity = ld.severity
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
