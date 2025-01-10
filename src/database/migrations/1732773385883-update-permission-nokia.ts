import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePermissionNokia1732773385883 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO permission
          (name, description, created_by, updated_by, created_at, updated_at)
           VALUES
           ('nokiaTxn-alarms', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('nokiaTxn-devices', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('nokiaTxn-network', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('nokiaTxn-devicesSync', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('nokiaTxnAlarmConfig-create', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('nokiaTxnAlarmConfig-edit', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('nokiaTxnAlarmConfig-access', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6))

    `);

    await queryRunner.query(`
      INSERT INTO role_permission(roleId,permissionId) 
      SELECT r.id,p.id
      FROM permission p
      CROSS JOIN role r
      WHERE p.name IN ('nokiaTxn-alarms','nokiaTxn-devices','nokiaTxn-network','nokiaTxn-devicesSync','nokiaTxnAlarmConfig-create','nokiaTxnAlarmConfig-edit','nokiaTxnAlarmConfig-access')
      AND r.name = 'SUPER_ADMIN'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
