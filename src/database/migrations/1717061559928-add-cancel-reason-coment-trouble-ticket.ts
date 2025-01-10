import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class AddCancelReasonCommentTroubleTicket1717061559928
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    //update dropdown table and permission table
    helperFunctions.dumpUp('drop_down_permissions-1717043511.sql');

    // add columns to trouble ticket table
    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'cancel_reason',
        type: 'int',
        isNullable: true,
      }),

      new TableColumn({
        name: 'cancel_comment',
        type: 'varchar',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'trouble_ticket',
      new TableForeignKey({
        columnNames: ['cancel_reason'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drop_down_item',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
