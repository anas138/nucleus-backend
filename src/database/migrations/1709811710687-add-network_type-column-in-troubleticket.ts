import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNetworkTypeColumnInTroubleticket1709811710687
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    alter table trouble_ticket add column network_type enum('transmission', 'ip') not null after app_type;`);
    await queryRunner.query(`
    update trouble_ticket set network_type = 'transmission' where app_type = 'NCE';`);
    await queryRunner.query(`
    update trouble_ticket set network_type = 'ip' where app_type = 'OBSERVIUM';`);
    await queryRunner.query(`
    create index app_type_index on trouble_ticket (app_type);`);
    await queryRunner.query(`
    create index network_type_index on trouble_ticket (network_type);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
