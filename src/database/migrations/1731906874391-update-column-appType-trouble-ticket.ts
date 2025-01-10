import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnAppTypeTroubleTicket1731906874391
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
       ALTER TABLE trouble_ticket
       MODIFY COLUMN network_type ENUM('transmission','ip','gpon') NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
