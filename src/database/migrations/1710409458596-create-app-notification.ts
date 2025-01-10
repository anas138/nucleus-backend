import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAppNotification1710409458596 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_notification',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'related_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'related_table',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'message',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE'],
            default: "'ACTIVE'",
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'sub_department_id',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'is_seen',
            type: 'boolean',
            default: false,
          },
          {
            name: 'is_open',
            type: 'boolean',
            default: false,
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

    await queryRunner.createForeignKeys('app_notification', [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['sub_department_id'],
        referencedTableName: 'sub_department',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('app_notification');
  }
}
