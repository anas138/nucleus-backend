import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTroubleTicketStatusLog1708324662631
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trouble_ticket_status_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'trouble_ticket_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'int',
            isNullable: false,
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
            default: 'NULL',
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
            default: 'NULL',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'trouble_ticket_status_log',
      new TableForeignKey({
        columnNames: ['trouble_ticket_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trouble_ticket',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'trouble_ticket_status_log',
      new TableForeignKey({
        columnNames: ['status'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drop_down_item',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trouble_ticket_status_log');
  }
}
