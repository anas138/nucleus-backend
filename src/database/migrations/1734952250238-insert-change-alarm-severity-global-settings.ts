import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertChangeAlarmSeverityGlobalSettings1734952250238
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO global_settings_types
        (id, name, constant, description, record_status, created_at, updated_at)
        VALUES(3, 'Alarm Filter Config Settings', 'ALARM_FILTER_CONFIG_SETTINGS', 'can change alarm filter config settings on the basis of conditions', 'ACTIVE', '2023-12-18 12:57:00.000', '2024-12-23 11:15:30.000'); 
    `);

    await queryRunner.query(
      "INSERT INTO global_settings \
      (global_setting_type_id, condition_value, `key`, value, value_datatype, record_status, sequence, created_at, updated_at) \
      VALUES ( \
      3, \
     'LDI_SOFTSWITCH_EMS', \
     'can_change_display_severity', \
     '1', \
     'NUMBER', \
     'ACTIVE', \
     1, \
    '2023-11-27 10:52:23.000', \
    '2024-12-23 11:38:15.000' \
);",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
