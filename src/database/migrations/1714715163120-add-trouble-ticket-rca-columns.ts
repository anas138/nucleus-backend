import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTroubleTicketRcaColumns1714715163120
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'rca_reason',
        type: 'varchar',
        isNullable: true,
      }),

      new TableColumn({
        name: 'corrective_action',
        type: 'varchar',
        isNullable: true,
      }),

      new TableColumn({
        name: 'preventive_step',
        type: 'varchar',
        isNullable: true,
      }),

      new TableColumn({
        name: 'rca_start_time',
        type: 'timestamp',
        isNullable: true,
      }),

      new TableColumn({
        name: 'rca_end_time',
        type: 'timestamp',
        isNullable: true,
      }),

      new TableColumn({
        name: 'is_rca_required',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),

      new TableColumn({
        name: 'rca_submitted',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
