import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTroubleTicketBulkUpdatePermission1728553807436
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO permission
            (name, description, created_by, updated_by, created_at, updated_at)
            VALUES( 'troubleTicket-bulkUpdate', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6));

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
