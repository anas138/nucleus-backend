import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTroubleTicketPauseColumns1715058217878
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'total_pause_duration_in_sec',
        type: 'int',
        isNullable: true,
      }),

      new TableColumn({
        name: 'last_unpause_date_time',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
