import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOutageFlagTroubleTicket1721027453891
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trouble_ticket',
      new TableColumn({
        name: 'is_outage_occurred',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
