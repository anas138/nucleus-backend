import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class DumpNokiaConfigRules1732792236834 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(`
       SELECT 1 FROM alarm_filter_config WHERE app_type = 'NOKIA_TXN'
    `);
    if (result.length === 0)
      await helperFunctions.dumpUp('alarm_filter_config_202411281608.sql');
      queryRunner.query(`
        UPDATE alarm_filter_config a
        SET a.created_by = (SELECT u.id 
        FROM user u
        WHERE u.user_type = 'SYSTEM_USER' )
        WHERE a.app_type = 'NOKIA_TXN'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
