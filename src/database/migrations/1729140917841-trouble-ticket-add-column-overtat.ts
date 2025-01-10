import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class TroubleTicketAddColumnOvertat1729140917841 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
          'trouble_ticket',
          new TableColumn({
            name: 'over_tat',
            type: 'boolean',
            isNullable: true,
            default: false,
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
