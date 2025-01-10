import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAdvanceAlarmFilterConfigCompositeKey1726057267474
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE alarm_filter_advance_condition
        DROP INDEX IDX_af9b010595e15aedc77b6d9ba5;
    `);

    await queryRunner.query(`
      ALTER TABLE alarm_filter_advance_condition
      ADD INDEX IDX_af9b010595e15aedc77b6d9ba5 (id, field_name, field_value,search_criteria,alarm_filter_config_id,record_status);  
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
