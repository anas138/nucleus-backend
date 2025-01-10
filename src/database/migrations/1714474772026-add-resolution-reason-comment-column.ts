import { HelperFunctions } from '../../common/util/helper-functions';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
const helperFunctions = new HelperFunctions();

export class AddResolutionReasonCommentColumn1714474772026
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('drop_down-1714352232.sql');

    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'resolution_reason',
        type: 'int',
        isNullable: true,
      }),

      new TableColumn({
        name: 'resolution_comment',
        type: 'varchar',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'trouble_ticket',
      new TableForeignKey({
        columnNames: ['resolution_reason'],
        referencedColumnNames: ['id'], // Assuming 'id' is the primary key column of SubDepartment table
        referencedTableName: 'drop_down_item',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
