import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnNokiaDeviceIdDeviceEscalation1732773807979
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE alarm_filter_escalation_device
            MODIFY COLUMN nokia_device_id int DEFAULT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
