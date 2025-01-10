import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddResolveCompletedDateTimeColumn1711692508652
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'resolved_Date_Time',
        type: 'timestamp',
        isNullable: true,
      }),

      new TableColumn({
        name: 'completed_Date_Time',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
