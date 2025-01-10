import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateTemplateTypeColumnFilterTemplate1733989624508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
          queryRunner.query(`
           ALTER TABLE filters_template
           MODIFY COLUMN template_type ENUM('nce-alarms-filters','observium-alarms-filters','nce-gpon-alarms-filters','nokia-txn-alarms-filters','ldi-softswitch-alarms-filter','') NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
