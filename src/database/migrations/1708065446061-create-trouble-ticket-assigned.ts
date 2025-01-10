import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTroubleTicketAssigned1708065446061
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trouble_ticket_assigned',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'trouble_ticket_id', type: 'int' },
          { name: 'assigned_to_id', type: 'int' },
          { name: 'assigned_from_id', type: 'int' },
          { name: 'from_sub_department_id', type: 'int' },
          { name: 'to_sub_department_id', type: 'int' },

          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DRAFT'],
            default: "'ACTIVE'",
          },
          { name: 'created_by', type: 'int', isNullable: true },
          { name: 'updated_by', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['trouble_ticket_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'trouble_ticket',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['assigned_to_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          }),
          new TableForeignKey({
            columnNames: ['assigned_from_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
          }),
          new TableForeignKey({
            columnNames: ['from_sub_department_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sub_department',
          }),
          new TableForeignKey({
            columnNames: ['to_sub_department_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sub_department',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trouble_ticket_assigned');
  }
}
