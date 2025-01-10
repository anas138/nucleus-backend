import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class DumpGponAlarmFilterConfig1731911537748
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(`
       SELECT 1 FROM alarm_filter_config WHERE app_type = 'NCE_GPON'
    `);
    if (result.length === 0)
      helperFunctions.dumpUp('alarm_filter_config_gpon_202411181227.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
