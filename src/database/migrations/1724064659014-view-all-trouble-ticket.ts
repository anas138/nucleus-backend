import { MigrationInterface, QueryRunner } from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
const helperFunctions = new HelperFunctions();

export class ViewAllTroubleTicket1724064659014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      INSERT INTO permission
      ( name, description, created_by, updated_by, created_at, updated_at)
      VALUES( 'troubleTicket-viewAllTickets', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6));
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
