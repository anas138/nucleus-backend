import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignBulkUpdatePermissionToSuperAdmin1728554134520
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO role_permission (permissionId, roleId)
            SELECT p.id, r.id
            FROM role r
            CROSS JOIN permission p 
            WHERE p.name = 'troubleTicket-bulkUpdate' AND r.name = 'SUPER_ADMIN';

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
