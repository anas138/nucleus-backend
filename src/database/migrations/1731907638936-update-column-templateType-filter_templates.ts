import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnTemplateTypeFilterTemplates1731907638936
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
       ALTER TABLE filters_template
       MODIFY COLUMN template_type ENUM('nce-alarms-filters','observium-alarms-filters','nce-gpon-alarms-filters','') 
       NOT NULL DEFAULT '';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
