import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStatusLdiTrunkGroup1735032495689
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`UPDATE ldi_softswitch_trunk_group ld
       SET ld.status = 'Not Commercial'
       WHERE ld.status= 'Not commercia'
       `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
