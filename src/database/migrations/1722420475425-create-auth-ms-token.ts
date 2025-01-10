import { RecordStatus } from 'src/common/enums/enums';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuthMsToken1722420475425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'auth_ms_token',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'ms_org_email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'access_token',
            type: 'text',
            length: '255',
          },

          {
            name: 'scopes',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'expires_on',
            type: 'datetime',
          },
          {
            name: 'record_status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DRAFT'],
            default: "'ACTIVE'",
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('auth_ms_token');
  }
}
