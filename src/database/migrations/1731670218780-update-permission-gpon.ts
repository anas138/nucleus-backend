import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePermissionGpon1731670218780 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO permission
          (name, description, created_by, updated_by, created_at, updated_at)
           VALUES
           ('gpon-alarms', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('gpon-devices', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('gpon-network', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('gpon-devicesSync', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('gponAlarmConfig-create', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('gponAlarmConfig-edit', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('gponAlarmConfig-access', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6))

    `);

    await queryRunner.query(`
      INSERT INTO role_permission(roleId,permissionId) 
      SELECT r.id,p.id
      FROM permission p
      CROSS JOIN role r
      WHERE p.name IN ('gpon-alarms','gpon-devices','gpon-network','gpon-devicesSync','gponAlarmConfig-create','gponAlarmConfig-edit','gponAlarmConfig-access')
      AND r.name = 'SUPER_ADMIN'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
