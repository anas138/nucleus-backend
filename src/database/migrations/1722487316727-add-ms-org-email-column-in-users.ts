import { query } from 'express';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMsOrgEmailColumnInUsers1722487316727
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `alter table user add column ms_org_email varchar(255) not null after email;`,
    );

    await queryRunner.query(`
        UPDATE user
        SET ms_org_email = CASE 
        WHEN email LIKE '%@tes.com.pk' THEN CONCAT(SUBSTRING_INDEX(email, '@', 1), '@tw1.com')
        ELSE email 
        end;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`Alter table users drop column ms_org_email;`);
  }
}
