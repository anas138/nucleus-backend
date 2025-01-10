import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateNceGponAlarms1731066531791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS nce_gpon_alarm
  `);
    await queryRunner.query(`
  CREATE TABLE nce_gpon_alarm (
  id int(11) NOT NULL AUTO_INCREMENT,
  severity enum('critical','major','minor','warning') NOT NULL,
  category varchar(255) DEFAULT NULL,
  event_type varchar(255) DEFAULT NULL,
  nce_alarm_id int(11) DEFAULT NULL,
  alarm_text varchar(255) DEFAULT NULL,
  alarm_type varchar(255) DEFAULT NULL,
  layer varchar(255) DEFAULT NULL,
  md_name varchar(255) DEFAULT NULL,
  alarm_serial_number varchar(255) DEFAULT NULL,
  native_probable_cause varchar(255) DEFAULT NULL,
  probable_cause text DEFAULT NULL,
  location_info text DEFAULT NULL,
  ne_name varchar(255) DEFAULT NULL,
  product_type varchar(255) DEFAULT NULL,
  other_info text DEFAULT NULL,
  impacted_resource text DEFAULT NULL,
  created_on_date datetime DEFAULT NULL,
  cleared_on_date datetime DEFAULT NULL,
  acknowledged_on datetime DEFAULT NULL,
  is_cleared tinyint(4) NOT NULL DEFAULT 0,
  last_changed_on timestamp NOT NULL DEFAULT current_timestamp(),
  ltp_resource_id varchar(40) DEFAULT NULL,
  ne_resource_id varchar(40) DEFAULT NULL,
  resource_type enum('NE','LTP') NOT NULL,
  trail_name text DEFAULT NULL,
  fiber_name text DEFAULT NULL,
  ason_obj_name text DEFAULT NULL,
  alarm_type_id varchar(255) DEFAULT NULL,
  loc_info_frame varchar(255) DEFAULT NULL,
  loc_info_slot varchar(255) DEFAULT NULL,
  loc_info_subslot varchar(255) DEFAULT NULL,
  loc_info_port varchar(255) DEFAULT NULL,
  loc_info_onu_id varchar(255) DEFAULT NULL,
  loc_info_type_id varchar(255) DEFAULT NULL,
  alarm_filter_config_id int(11) DEFAULT NULL,
  created_on datetime DEFAULT NULL,
  cleared_on datetime DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  KEY idx_ne_resource_id_nce_gpon_alarm (ne_resource_id),
  KEY idx_alarm_filter_config_id_nce_gpon_alarm (alarm_filter_config_id),
  KEY idx_severity (severity),
  KEY IDX_ALARM_SERIAL_NUMBER (alarm_serial_number),
  CONSTRAINT nce_gpon_alarm_alarm_filter_config_id FOREIGN KEY (alarm_filter_config_id) REFERENCES alarm_filter_config (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT nce_gpon_alarm_nce_gpon_network_element_ne_resource_id FOREIGN KEY (ne_resource_id) REFERENCES nce_gpon_network_element (resource_id) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('nce_gpon_alarm');
  }
}
