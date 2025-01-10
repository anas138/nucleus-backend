import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddAlarmFilterIdToObserviumAlertTable1694494348959
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    Alter table observium_alert modify column alert_severity enum ('Critical', 'Warning');
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
