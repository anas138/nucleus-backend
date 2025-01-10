import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateGponNetworkElement1730891091997
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP TABLE IF EXISTS nce_gpon_subnet
`);
    await queryRunner.query(`
    CREATE TABLE nce_gpon_subnet (
        res_id VARCHAR(255) NOT NULL,
        x_pos INT DEFAULT NULL,
        name VARCHAR(255) DEFAULT NULL,
        ref_parent_subnet VARCHAR(255) DEFAULT NULL,
        y_pos INT DEFAULT NULL,
        type_id VARCHAR(255) DEFAULT NULL,
        origin VARCHAR(255) DEFAULT NULL,
        node_class VARCHAR(255) DEFAULT NULL,
        PRIMARY KEY (res_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`);

    await queryRunner.query(`
     DROP TABLE IF EXISTS nce_gpon_network_element
   `);

    await queryRunner.query(`
  CREATE TABLE nce_gpon_network_element (
  resource_id varchar(40) NOT NULL,
  is_virtual tinyint(4) DEFAULT NULL,
  lifecycle_state varchar(255) DEFAULT NULL,
  ip_address varchar(255) DEFAULT NULL,
  is_gateway int(11) DEFAULT NULL,
  is_in_ac_domain tinyint(4) DEFAULT NULL,
  dev_sys_name varchar(255) DEFAULT NULL,
  physical_id int(11) DEFAULT NULL,
  container tinyint(4) DEFAULT NULL,
  patch_version varchar(255) DEFAULT NULL,
  pre_config int(11) DEFAULT NULL,
  product_name varchar(255) DEFAULT NULL,
  manufacture_date datetime DEFAULT NULL,
  location varchar(255) DEFAULT NULL,
  user_label varchar(255) DEFAULT NULL,
  ref_parent_subnet varchar(255) DEFAULT NULL,
  software_version varchar(255) DEFAULT NULL,
  gateway_id_list text DEFAULT NULL,
  manufacturer varchar(255) DEFAULT NULL,
  remark varchar(255) DEFAULT NULL,
  name varchar(255) NOT NULL,
  hardware_version varchar(255) DEFAULT NULL,
  detail_dev_type_name varchar(255) DEFAULT NULL,
  communication_state varchar(255) DEFAULT NULL,
  alias varchar(255) DEFAULT NULL,
  enable_ason int(11) DEFAULT NULL,
  admin_status varchar(255) DEFAULT NULL,
  roles varchar(255) DEFAULT NULL,
  nce_create_time datetime DEFAULT NULL,
  nce_last_modified datetime DEFAULT NULL,
  created_on datetime NOT NULL DEFAULT current_timestamp(),
  region_id int(11) DEFAULT NULL,
  ne_reference_id varchar(255) DEFAULT NULL,
  record_status enum('ACTIVE','INACTIVE','DELETED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (resource_id),
  KEY idx_region_id (region_id),
  KEY idx_ref_parent_subnet (ref_parent_subnet),
  CONSTRAINT region_region_id FOREIGN KEY (region_id) REFERENCES region (id) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('nce_gpon_subnet');
    await queryRunner.dropTable('nce_gpon_network_element');
  }
}
