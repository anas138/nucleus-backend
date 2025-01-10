import { EscalationLevel, RecordStatus, TatUot } from 'src/common/enums/enums';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTroubleTicket1707983469395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'trouble_ticket',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ticket_number',
            type: 'varchar',
            length: '255',
            isNullable: true,
            isUnique: true,
            default: null,
          },
          {
            name: 'alarm_id',
            type: 'int',
          },
          {
            name: 'alarm_config_id',
            type: 'int',
          },
          {
            name: 'app_type',
            type: 'varchar',
            isNullable: true,
            default: null,
          },
          {
            name: 'case_title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'trouble_ticket_category_id',
            type: 'int',
          },
          {
            name: 'trouble_ticket_sub_category_id',
            type: 'int',
          },
          {
            name: 'medium',
            type: 'int',
          },
          {
            name: 'status',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'is_assigned',
            type: 'boolean',
            default: false,
          },
          {
            name: 'assigned_to_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'assigned_from_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'esclationLevel',
            type: 'enum',
            enum: Object.values(EscalationLevel),
            isNullable: true,
          },
          {
            name: 'esclation_role_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'total_tat',
            type: 'int',
          },
          {
            name: 'tat_start_time',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'tat_end_time',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'department_id',
            type: 'int',
          },
          {
            name: 'sub_department_id',
            type: 'int',
          },
          {
            name: 'record_status',
            type: 'enum',
            enum: Object.values(RecordStatus),
            isNullable: true,
            default: `'${RecordStatus.ACTIVE}'`,
          },
          {
            name: 'tat_uom',
            type: 'enum',
            enum: Object.values(TatUot),
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

    await queryRunner.createForeignKeys('trouble_ticket', [
      new TableForeignKey({
        columnNames: ['trouble_ticket_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trouble_ticket_category',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['trouble_ticket_sub_category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trouble_ticket_category',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['medium'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drop_down_item',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['status'],
        referencedColumnNames: ['id'],
        referencedTableName: 'drop_down_item',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['assigned_to_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['assigned_from_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['esclation_role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['department_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'department',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['sub_department_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sub_department',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['alarm_config_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'alarm_filter_config',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
