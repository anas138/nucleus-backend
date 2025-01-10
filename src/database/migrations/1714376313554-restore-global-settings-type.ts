import { MigrationInterface, QueryRunner } from "typeorm"
import { HelperFunctions } from 'src/common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class InsertGlobalSettingsType1714376313554 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await helperFunctions.dumpUp('global_settings_types-1714376999.sql');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
