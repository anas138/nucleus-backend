import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTitleColumnAppNotification1712296424175
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trouble_ticket',
      new TableColumn({
        name: 'message_title',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'app_notification',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        default: "'New Notification'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
