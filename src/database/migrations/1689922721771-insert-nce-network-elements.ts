import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();
export class InsertNceNetworkElements1689922721771
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'nce-network-element-nucleus_listener-202307211527.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
