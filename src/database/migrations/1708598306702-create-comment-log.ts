import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCommentLog1708598306702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comment_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'related_id', type: 'int', isNullable: false },
          {
            name: 'related_table',
            type: 'varchar(255)',
            isNullable: false,
          },
          { name: 'comment', type: 'text' },
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comment_log');
  }
}
