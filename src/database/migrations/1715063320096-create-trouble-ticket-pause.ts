import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTroubleTicketPause1715063320096
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trouble_ticket_pause',
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
          },
          {
            name: 'pause_start_time',
            type: 'datetime',
            default: null,
          },
          {
            name: 'pause_end_time',
            type: 'datetime',
            default: null,
          },
          {
            name: 'pause_reason',
            type: 'varchar',
          },
          {
            name: 'is_approved',
            type: 'boolean',
          },
          {
            name: 'approved_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'paused_by',
            type: 'int',
          },
          {
            name: 'total_paused_duration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'sub_department_id',
            type: 'int',
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
    );

    await queryRunner.createForeignKey(
      'trouble_ticket_pause',
      new TableForeignKey({
        columnNames: ['trouble_ticket_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trouble_ticket',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'trouble_ticket_pause',
      new TableForeignKey({
        columnNames: ['approved_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'trouble_ticket_pause',
      new TableForeignKey({
        columnNames: ['paused_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'trouble_ticket_pause',
      new TableForeignKey({
        columnNames: ['sub_department_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sub_department',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
