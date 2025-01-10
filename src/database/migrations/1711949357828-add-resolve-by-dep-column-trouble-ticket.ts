import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddResolveByDepColumnTroubleTicket1711949357828
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trouble_ticket',
      new TableColumn({
        name: 'resolved_by_sub_department',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'trouble_ticket',
      new TableForeignKey({
        columnNames: ['resolved_by_sub_department'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sub_department',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
