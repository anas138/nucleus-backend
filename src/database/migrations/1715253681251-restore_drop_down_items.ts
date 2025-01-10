import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestoreDropDownItems1715253681251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    helperFunctions.dumpUp('restore_drop_down_item-1714880880.sql');

    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'current_pause_id',
        type: 'int',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'trouble_ticket',
      new TableForeignKey({
        columnNames: ['current_pause_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trouble_ticket_pause',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
