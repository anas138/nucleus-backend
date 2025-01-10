import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnNceGounDeviceInEscalationDevice1731650058380
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE alarm_filter_escalation_device
        ADD COLUMN nce_gpon_device_id VARCHAR(255)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
