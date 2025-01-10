import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateLsdiSoftswitchAlarm1733815748998
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ldi_softswitch_ems_alarm',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ems_alarm_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'event_time',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'source_ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'severity',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'class_txt',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'syslog_ip',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'syslog_source',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'error_code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'message',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'message_state',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'trunk_group',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type_txt',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'subtype_txt',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ldi_softswitch_trunk_group_id',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'is_cleared',
            type: 'boolean',
            default: false,
          },

          {
            name: 'created_on',
            type: 'timestamp',
            isNullable: true,
          },

          {
            name: 'cleared_on',
            type: 'timestamp',
            isNullable: true,
          },

          {
            name: 'alarm_type',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'alarm_filter_config_id',
            type: 'int',
            isNullable: true,
          },

          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DRAFT'],
            default: "'ACTIVE'",
            isNullable: true,
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

    // Add the foreign key
    await queryRunner.createForeignKey(
      'ldi_softswitch_ems_alarm',
      new TableForeignKey({
        columnNames: ['ldi_softswitch_trunk_group_id'],
        referencedTableName: 'ldi_softswitch_trunk_group',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ldi_softswitch_ems_alarm',
      new TableForeignKey({
        columnNames: ['alarm_filter_config_id'],
        referencedTableName: 'alarm_filter_config',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ldi_softswitch_ems_alarm',
      new TableForeignKey({
        columnNames: ['alarm_type'],
        referencedTableName: 'drop_down_item',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
