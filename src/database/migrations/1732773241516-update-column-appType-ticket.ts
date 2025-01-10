import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnAppTypeTicket1732773241516
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
       ALTER TABLE trouble_ticket
       MODIFY COLUMN network_type ENUM('transmission','ip','gpon','nokia_txn') NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
