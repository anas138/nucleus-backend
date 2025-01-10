import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmailLogsPermission1701250731088
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO permission
        (name, description, created_by, updated_by, created_at, updated_at)
        VALUES('emailLogs-access', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6));
    `);

    await queryRunner.query(`
        INSERT INTO role_permission(permissionId,roleId)
        SELECT p.id,r.id 
        FROM role r 
        CROSS JOIN permission p
        WHERE r.name='SUPER_ADMIN'AND p.name='emailLogs-access'
    `);

    await queryRunner.query(`
        INSERT INTO user_permission(permissionId,userId)
        SELECT p.id,u.id 
        FROM user u 
        CROSS JOIN permission p
        WHERE u.username='super.admin'AND p.name='emailLogs-access' 
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
