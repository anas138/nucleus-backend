import { RecordStatus } from 'src/common/enums/enums';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateAppDashboardWidget1703763838513
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_dashboard_widget',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'widget_type_id', type: 'int' },
          {
            name: 'is_shared',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          { name: 'app_dashboard_id', type: 'int' },
          { name: 'alarm_config_id', type: 'int' },
          { name: 'comment', type: 'text' },
          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DRAFT'],
            default: "'ACTIVE'",
          },
          { name: 'created_by', type: 'int', isNullable: true, default: null },
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

    // Adding foreign keys
    await queryRunner.createForeignKeys('app_dashboard_widget', [
      new TableForeignKey({
        columnNames: ['app_dashboard_id'],
        referencedTableName: 'app_dashboard',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['alarm_config_id'],
        referencedTableName: 'alarm_filter_config',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['widget_type_id'],
        referencedTableName: 'drop_down_item',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.dropForeignKey(
      'app_dashboard_widget',
      'FK_app_dashboard_widget_app_dashboard_id',
    );
    await queryRunner.dropForeignKey(
      'app_dashboard_widget',
      'FK_app_dashboard_widget_alarm_config_id',
    );

    // Then drop the table
    await queryRunner.dropTable('app_dashboard_widget');
  }
}
