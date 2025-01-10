import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableAlterObsAlertDropAlterTimestampIndex1696402084732
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX IDX_14fe6eb9f2ef931b847a91d679 ON observium_alert    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
