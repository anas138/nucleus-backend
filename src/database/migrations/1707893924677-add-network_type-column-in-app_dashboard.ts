import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNetworkTypeColumnInAppDashboard1707893924677
  implements MigrationInterface
{
  /**
   *
   * @param queryRunner
   * @description add network_type column, update data & create missing indexes onthis table
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    alter table app_dashboard  add column network_type enum('transmission', 'ip') not null after app_type;`);
    await queryRunner.query(`
    update app_dashboard set network_type = 'transmission' where app_type  = 'NCE';`);
    await queryRunner.query(`
    update app_dashboard set network_type = 'ip' where app_type  = 'OBSERVIUM';`);
    await queryRunner.query(`
    create index app_type_index on app_dashboard (app_type);`);
    await queryRunner.query(`
    create index network_type_index on app_dashboard (network_type);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
