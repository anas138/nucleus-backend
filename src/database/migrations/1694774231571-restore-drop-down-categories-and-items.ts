import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();

export class RestoreDropDownCategoriesAndItems1694774231571
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'restore-drop-downs-nucleus_listener-202309151536.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
