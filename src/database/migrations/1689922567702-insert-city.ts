import { HelperFunctions } from 'src/common/util/helper-functions';
import { MigrationInterface, QueryRunner } from 'typeorm';

const helperFunctions = new HelperFunctions();
export class InsertCity1689922567702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await helperFunctions.dumpUp('world_cities-nucleus_listener-202307211307.sql');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
