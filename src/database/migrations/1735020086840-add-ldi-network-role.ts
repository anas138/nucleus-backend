import { query } from 'express';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLdiNetworkRole1735020086840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO role
            (name, created_at, updated_at, updated_by, created_by, description)
            VALUES('LDI Network', current_timestamp(6), current_timestamp(6), NULL, NULL, NULL);
`);

    queryRunner.query(`
        INSERT INTO role_permission (permissionId, roleId)
        SELECT p.id, r.id
        FROM permission p
        CROSS JOIN role r  
        WHERE r.name = 'LDI Network' 
        AND p.name IN ('ldiSoftswitch-alarms', 'ldiSoftswitch-trunkGroup', 'ldiSoftswitch-network', 'ldiSoftswitch-trunkGroupSync', 'ldiSoftswitchAlarmConfig-access');

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
