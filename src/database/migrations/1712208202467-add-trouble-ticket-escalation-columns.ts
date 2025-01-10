import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';

const helperFunctions = new HelperFunctions();
export class AddTroubleTicketEscalationColumns1712207146579
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('restore_drop_down_settings-1711943972.sql');

    await queryRunner.addColumns('trouble_ticket', [
      new TableColumn({
        name: 'ticket_generation_type',
        type: 'int',
        default: 37,
        isNullable: false,
      }),

      new TableColumn({
        name: 'alarm_config_can_revert',
        type: 'boolean',
        isNullable: true,
      }),

      new TableColumn({
        name: 'alarm_config_escalation_delay',
        type: 'int',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKey(
      'trouble_ticket',
      new TableForeignKey({
        columnNames: ['ticket_generation_type'],
        referencedColumnNames: ['id'], // Assuming 'id' is the primary key column of SubDepartment table
        referencedTableName: 'drop_down_item',
        onDelete: 'cascade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
