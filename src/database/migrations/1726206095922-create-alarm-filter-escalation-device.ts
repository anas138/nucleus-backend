import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAlarmFilterEscalationDevice1726206095922
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'alarm_filter_escalation_device',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'alarm_filter_config_id',
            type: 'int',
          },
          {
            name: 'app_type',
            type: 'varchar',
          },
          {
            name: 'nce_device_id',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'obs_device_id',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'nokia_device_id',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DRAFT'],
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
    );

    // Creating foreign key for alarm_filter_config_id
    await queryRunner.createForeignKey(
      'alarm_filter_escalation_device',
      new TableForeignKey({
        columnNames: ['alarm_filter_config_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'alarm_filter_config',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropping the foreign key
    const table = await queryRunner.getTable('alarm_filter_escalation_device');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('alarm_filter_config_id') !== -1,
    );
    await queryRunner.dropForeignKey(
      'alarm_filter_escalation_device',
      foreignKey,
    );

    // Dropping the table
    await queryRunner.dropTable('alarm_filter_escalation_device');
  }
}
