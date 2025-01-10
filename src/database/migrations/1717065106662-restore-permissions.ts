import { MigrationInterface, QueryRunner } from "typeorm"
import { HelperFunctions } from '../../common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class RestorePermissions1717065106662 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        helperFunctions.dumpUp('nucleus_permissions-1717043511.sql');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
