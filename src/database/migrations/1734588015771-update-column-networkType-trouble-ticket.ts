import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnNetworkTypeTroubleTicket1734588015771
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
         ALTER TABLE trouble_ticket
         MODIFY COLUMN network_type ENUM('transmission','ip','gpon','nokia_txn','ldi_softswitch') NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
