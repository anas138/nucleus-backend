import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionAddTroubleTicketPriorityOvertatPermissions1729141221697
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           INSERT INTO permission
          (name, description, created_by, updated_by, created_at, updated_at)
          VALUES
         ('ticketOverTatEscalations-P1Tickets', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
         ('ticketOverTatEscalations-P2Tickets', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
         ('ticketOverTatEscalations-P3Tickets', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
         ('ticketPriorityNotifications-P1Tickets', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
         ('ticketPriorityNotifications-P2Tickets', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
         ('ticketPriorityNotifications-P3Tickets', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6));
   `);

    await queryRunner.query(`
       INSERT INTO role_permission 
       (permissionId, roleId)
       SELECT p.id, r.id
       FROM role r
       CROSS JOIN permission p
       WHERE r.name = 'SUPER_ADMIN'
       AND p.name IN (
      'ticketOverTatEscalations-P1Tickets',
      'ticketOverTatEscalations-P2Tickets',
      'ticketOverTatEscalations-P3Tickets',
      'ticketPriorityNotifications-P1Tickets',
      'ticketPriorityNotifications-P2Tickets',
      'ticketPriorityNotifications-P3Tickets'
     );
   `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
