import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultColumnAppDashboard1706159348971
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE app_dashboard
        ADD COLUMN is_default BOOLEAN NOT NULL DEFAULT FALSE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
