import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddRegionColumn1719810100550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trouble_ticket',
      new TableColumn({
        name: 'region_id',
        type: 'int',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.createForeignKey(
      'trouble_ticket',
      new TableForeignKey({
        columnNames: ['region_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'region',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
