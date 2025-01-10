import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSystemUserUpdateUserType1712208202467
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user
       MODIFY COLUMN user_type ENUM('EMPLOYEE', 'GROUP', 'SYSTEM_USER')
       DEFAULT 'EMPLOYEE';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
