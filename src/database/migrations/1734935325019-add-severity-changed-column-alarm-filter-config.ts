import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeverityChangedColumnAlarmFilterConfig1734935325019
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
          ALTER TABLE alarm_filter_config
          ADD COLUMN is_change_in_display_severity BOOLEAN DEFAULT false,
          ADD COLUMN conditional_severity varchar(50) DEFAULT NULL,
          ADD COLUMN severity_to_be_displayed varchar(50) DEFAULT NULL;

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
