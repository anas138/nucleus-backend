import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnAppDashboard1734586435225
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
         ALTER TABLE app_dashboard
         MODIFY COLUMN app_type ENUM('NCE', 'OBSERVIUM', 'NCE_GPON', 'NOKIA_TXN', 'LDI_SOFTSWITCH_EMS') NOT NULL,
         MODIFY COLUMN network_type ENUM('transmission', 'ip', 'gpon', 'ldi_softswitch') NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
