import { MigrationInterface, QueryRunner } from "typeorm"

export class ModifyTemplateFilterColumnTemplateType1732793831675 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         queryRunner.query(`
           ALTER TABLE filters_template
           MODIFY COLUMN template_type ENUM('nce-alarms-filters','observium-alarms-filters','nce-gpon-alarms-filters','nokia-txn-alarms-filters','') NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
