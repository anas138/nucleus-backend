import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLdiSoftswitchPermissions1734498062522
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO permission
          (name, description, created_by, updated_by, created_at, updated_at)
           VALUES
           ('ldiSoftswitch-alarms', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('ldiSoftswitch-trunkGroup', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('ldiSoftswitch-network', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('ldiSoftswitch-trunkGroupSync', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('ldiSoftswitchAlarmConfig-create', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('ldiSoftswitchAlarmConfig-edit', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6)),
           ('ldiSoftswitchAlarmConfig-access', NULL, NULL, NULL, current_timestamp(6), current_timestamp(6))

    `);

    await queryRunner.query(`
      INSERT INTO role_permission(roleId,permissionId) 
      SELECT r.id,p.id
      FROM permission p
      CROSS JOIN role r
      WHERE p.name IN ('ldiSoftswitch-alarms','ldiSoftswitch-trunkGroup','ldiSoftswitch-network','ldiSoftswitch-trunkGroupSync','ldiSoftswitchAlarmConfig-create','ldiSoftswitchAlarmConfig-edit','ldiSoftswitchAlarmConfig-access')
      AND r.name = 'SUPER_ADMIN'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
