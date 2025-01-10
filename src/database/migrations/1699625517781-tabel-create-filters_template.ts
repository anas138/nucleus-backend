import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();

export class TabelCreateFiltersTemplate1699625517781
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp(
      'nucleusFilters_Template-nucleus_listener-202311100607.sql',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Your down migration logic here
  }
}
