import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class TroubleTicketAddColumn1711532897475 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'resolved_time',
        type: 'varchar',
        isNullable: true,
      }),

      new TableColumn({
        name: 'completed_time',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
