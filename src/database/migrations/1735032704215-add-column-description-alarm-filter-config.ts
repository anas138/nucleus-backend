import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnDescriptionAlarmFilterConfig1735032704215
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
         ALTER TABLE alarm_filter_config
         ADD COLUMN description varchar(255) NULL DEFAULT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
