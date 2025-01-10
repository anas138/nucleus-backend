import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableModifyUserSession1695201484210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `user_session` MODIFY `token` VARCHAR(500) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
