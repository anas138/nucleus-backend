import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastLoginUserSession1704882842100
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user_session ADD COLUMN last_activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    );

    await queryRunner.query(`
      ALTER TABLE user_session
      MODIFY COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user_session DROP COLUMN last_activity_time',
    );
  }
}
