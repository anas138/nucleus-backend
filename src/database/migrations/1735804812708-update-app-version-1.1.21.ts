import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAppVersion1735804812708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "update global_settings set value = '1.1.21',updated_at = now() where global_setting_type_id = 1 and `key` ='app_version';",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "update global_settings set value = '1.1.20',updated_at = now() where global_setting_type_id = 1 and `key` ='app_version';",
    );
  }
}
