import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateTroubleTicketAccumulation1719383838457
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trouble_ticket_outage_alarms',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ticket_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'alarm_config_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'alarm_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE'],
            default: "'ACTIVE'",
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('trouble_ticket_outage_alarms', [
      new TableForeignKey({
        columnNames: ['ticket_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trouble_ticket',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['alarm_config_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'alarm_filter_config',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['alarm_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'observium_alert',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    ]);

    //add nms_circuit_id in observium
    await queryRunner.addColumn(
      'observium_alert',
      new TableColumn({
        name: 'nms_circuit_id',
        type: 'varchar',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
