import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTroubleTicketPermission1713259847927
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `INSERT INTO permission
      (id, name, description, created_by, updated_by, created_at, updated_at)
      VALUES(41, 'troubleTicket-create', NULL, NULL, NULL, '2024-04-15 16:29:39.744', '2024-04-15 16:29:39.744');`,
    );

    queryRunner.query(
      `INSERT INTO permission
       (id, name, description, created_by, updated_by, created_at, updated_at)
       VALUES(42, 'troubleTicket-access', NULL, NULL, NULL, '2024-04-15 16:29:39.744', '2024-04-15 16:29:39.744');`,
    );

    queryRunner.query(`
      INSERT INTO role_permission
      (permissionId, roleId)
      SELECT p.id,r.id FROM permission p CROSS JOIN  role r
      WHERE p.name='troubleTicket-create' AND r.name = 'SUPER_ADMIN'
      `);

    queryRunner.query(`
      INSERT INTO role_permission
      (permissionId, roleId)
      SELECT p.id,r.id FROM permission p CROSS JOIN  role r
      WHERE p.name='troubleTicket-access' AND r.name = 'SUPER_ADMIN'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
