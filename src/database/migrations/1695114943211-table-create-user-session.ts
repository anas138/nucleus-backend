import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableCreateUserSession1695114943211 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE \`user_session\` (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`user_id\` int(11) NOT NULL,
      \`token\` varchar(255) NOT NULL,
      \`ip\` varchar(255) DEFAULT NULL,
      \`client\` varchar(500) DEFAULT NULL,
      \`status\` enum('LOGIN','LOGOUT') DEFAULT NULL,
      \`login_time\` datetime DEFAULT NULL,
      \`logout_time\` datetime DEFAULT NULL,
      \`created_at\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`updated_at\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      PRIMARY KEY (\`id\`),
      KEY \`FK_13275383dcdf095ee29f2b3455a\` (\`user_id\`),
      CONSTRAINT \`FK_13275383dcdf095ee29f2b3455a\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
