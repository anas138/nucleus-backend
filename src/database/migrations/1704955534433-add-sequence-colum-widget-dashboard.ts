import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSequenceColumWidgetDashboard1704955534433
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE app_dashboard_widget
        ADD COLUMN sequence INTEGER  NOT NULL DEFAULT 0;
        `);
    queryRunner.query(`
        ALTER TABLE app_dashboard_widget
        DROP COLUMN comment;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
