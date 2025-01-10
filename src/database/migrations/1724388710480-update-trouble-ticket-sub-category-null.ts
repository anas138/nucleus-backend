import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTroubleTicketSubCategoryNull1724388710480
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE trouble_ticket 
            MODIFY COLUMN trouble_ticket_sub_category_id INT NULL DEFAULT NULL;
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
