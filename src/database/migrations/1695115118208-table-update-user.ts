import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableUpdateUser1695115118208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user ADD last_login datetime
        `);
    await queryRunner.query(`
            ALTER TABLE user ADD last_password_changed datetime
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
