import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertUserSubdepartmentMapping1729148255481
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO user_subdepartment_mapping 
            (user_id, sub_department_id, department_id, record_status, created_by, updated_by, created_at, updated_at)
            SELECT 
            u.id, 
            u.sub_department_id, 
            u.department_id, 
           'ACTIVE' ,
            NULL , 
            NULL, 
            current_timestamp(6) , 
            current_timestamp(6)
            FROM user u
            WHERE u.sub_department_id IS NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
