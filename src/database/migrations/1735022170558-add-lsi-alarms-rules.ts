import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class AddLsiAlarmsRules1735022170558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(`
       SELECT 1 FROM alarm_filter_config WHERE app_type = 'LDI_SOFTSWITCH_EMS'
    `);
    if (result.length === 0) {
      helperFunctions.dumpUp('alarm_filter_config_202412241137-ldi.sql');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
