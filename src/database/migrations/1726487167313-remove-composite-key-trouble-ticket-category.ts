import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCompositeKeyTroubleTicketCategory1726487167313
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE trouble_ticket_category
        DROP CONSTRAINT UQ_cf68bcbe16c2ab3a540aaf35ebd;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
