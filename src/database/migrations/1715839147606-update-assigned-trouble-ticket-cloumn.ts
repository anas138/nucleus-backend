import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateAssignedTroubleTicketCloumn1715839147606 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE trouble_ticket_assigned MODIFY COLUMN assigned_to_id INT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
