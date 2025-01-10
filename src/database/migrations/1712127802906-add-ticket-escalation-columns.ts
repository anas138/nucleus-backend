import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddTicketEscalationColumns1712127802906
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('alarm_filter_config', [
      new TableColumn({
        name: 'ticket_escalation_initial_sub_department',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'ticket_escalation_medium',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'can_revert_ticket_on_alarm_recovery',
        type: 'boolean',
        isNullable: true,
      }),
      new TableColumn({
        name: 'ticket_escalation_category',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'ticket_escalation_sub_category',
        type: 'int', // Adjust the data type as per your requirement
        isNullable: true,
      }),
    ]);

    // Adding foreign keys
    await queryRunner.createForeignKey(
      'alarm_filter_config',
      new TableForeignKey({
        columnNames: ['ticket_escalation_initial_sub_department'],
        referencedColumnNames: ['id'], // Assuming 'id' is the primary key column of SubDepartment table
        referencedTableName: 'sub_department',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'alarm_filter_config',
      new TableForeignKey({
        columnNames: ['ticket_escalation_medium'],
        referencedColumnNames: ['id'], // Assuming 'id' is the primary key column of DropDownItem table
        referencedTableName: 'drop_down_item',
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'alarm_filter_config',
      new TableForeignKey({
        columnNames: ['ticket_escalation_category'],
        referencedColumnNames: ['id'], // Assuming 'id' is the primary key column of TroubleTicketCategory table
        referencedTableName: 'trouble_ticket_category',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'alarm_filter_config',
      new TableForeignKey({
        columnNames: ['ticket_escalation_sub_category'],
        referencedColumnNames: ['id'], // Assuming 'id' is the primary key column of TroubleTicketCategory table
        referencedTableName: 'trouble_ticket_category',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
