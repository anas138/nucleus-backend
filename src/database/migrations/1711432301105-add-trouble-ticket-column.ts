import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTroubleTicketColumn1711432301105 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trouble_ticket',
      new TableColumn({
        name: 'message',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
