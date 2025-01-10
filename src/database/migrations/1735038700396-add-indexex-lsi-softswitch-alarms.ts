import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexexLsiSoftswitchAlarms1735038700396
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE ldi_softswitch_ems_alarm 
            ADD INDEX message_state (message_state),
            ADD INDEX severity (severity),
            ADD INDEX source_ip (source_ip);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
