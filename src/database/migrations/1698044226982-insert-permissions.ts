import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();
export class InsertPermissions1698044226982 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'nucleusPermissionsDump-nucleus_listener-202310222351.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
