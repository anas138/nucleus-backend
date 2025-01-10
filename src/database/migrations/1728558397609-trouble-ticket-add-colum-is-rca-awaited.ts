import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class TroubleTicketAddColumIsRcaAwaited1728558397609
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trouble_ticket',
      new TableColumn({
        name: 'is_rca_awaited',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
