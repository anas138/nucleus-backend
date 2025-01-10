import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateToubleTicketCategory1707819894754
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trouble_ticket_category',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'parent_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'tat',
            type: 'int',
          },
          {
            name: 'tat_uom',
            type: 'enum',
            enum: ['HOURS', 'MINUTES'],
            default: "'HOURS'",
          },
          {
            name: 'record_status',
            type: 'varchar',
            default: "'ACTIVE'",
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['parent_id'],
            referencedTableName: 'trouble_ticket_category',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trouble_ticket_category');
  }
}
