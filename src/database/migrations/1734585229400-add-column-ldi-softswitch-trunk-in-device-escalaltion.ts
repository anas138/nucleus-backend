import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnLdiSoftswitchTrunkInDeviceEscalaltion1734585229400
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
          ALTER TABLE alarm_filter_escalation_device
          ADD COLUMN ldi_softswitch_trunk_group_id INT NULL DEFAULT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
