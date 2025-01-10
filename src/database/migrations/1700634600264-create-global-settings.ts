import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateGlobalSettings1700634600264 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'global_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'global_setting_type_id', type: 'int' },
          { name: 'condition_value', type: 'varchar', isNullable: false },
          { name: 'key', type: 'varchar', isNullable: false },
          { name: 'value', type: 'text', isNullable: false },
          {
            name: 'value_datatype',
            type: 'enum',
            enum: ['NUMBER', 'STRING', 'BOOLEAN', 'ARRAY'],
            isNullable: false,
          },
          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DRAFT'],
            default: "'ACTIVE'",
          },
          { name: 'sequence', type: 'int', default: 1, isNullable: false },
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
    );

    await queryRunner.createForeignKey(
      'global_settings',
      new TableForeignKey({
        columnNames: ['global_setting_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'global_settings_types',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'global_settings',
      'FK_global_settings_global_setting_types',
    );
    await queryRunner.dropTable('global_settings');
  }
}
