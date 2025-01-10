import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';
const helperFunctions = new HelperFunctions();

export class InsertCrmWebAppVersion1701166274318 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('global_settings-1702965089.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
