import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateEmailLogs1701244161358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'subject', type: 'varchar', isNullable: true },
          { name: 'to', type: 'varchar', isNullable: true },
          { name: 'cc', type: 'text', isNullable: true },
          { name: 'html_body', type: 'text', isNullable: true },
          { name: 'from', type: 'varchar', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Adding indexes
    await queryRunner.createIndex(
      'email_logs',
      new TableIndex({ name: 'IDX_SUBJECT', columnNames: ['subject'] }),
    );
    await queryRunner.createIndex(
      'email_logs',
      new TableIndex({ name: 'IDX_TO', columnNames: ['to'] }),
    );
    await queryRunner.createIndex(
      'email_logs',
      new TableIndex({ name: 'IDX_CREATED_AT', columnNames: ['created_at'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('email_logs', 'IDX_SUBJECT');
    await queryRunner.dropIndex('email_logs', 'IDX_TO');
    await queryRunner.dropIndex('email_logs', 'IDX_CREATED_AT');
    await queryRunner.dropTable('email_logs');
  }
}
