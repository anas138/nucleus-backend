import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiTableModifyColumnName1695381213364
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE role CHANGE COLUMN modified_by  updated_by int(11);`,
    );
    await queryRunner.query(
      `ALTER TABLE segment CHANGE COLUMN modified_by  updated_by int(11);`,
    );
    await queryRunner.query(
      `ALTER TABLE sub_department CHANGE COLUMN modified_by  updated_by int(11);`,
    );
    await queryRunner.query(
      `ALTER TABLE upload_file_map CHANGE COLUMN modified_by  updated_by int(11);`,
    );
    await queryRunner.query(
      `ALTER TABLE upload_file CHANGE COLUMN modified_by  updated_by int(11);`,
    );
    await queryRunner.query(
      `ALTER TABLE user CHANGE COLUMN modified_by  updated_by int(11);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
