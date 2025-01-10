import { boolean } from 'joi';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTogglesUserTable1711594401496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'email_activate',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),

      new TableColumn({
        name: 'sms_activate',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),

      new TableColumn({
        name: 'notification_activate',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
