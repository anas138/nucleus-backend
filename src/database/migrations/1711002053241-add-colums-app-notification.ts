import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumsAppNotification1711002053241
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('app_notification', [
      new TableColumn({
        name: 'route',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'link',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
