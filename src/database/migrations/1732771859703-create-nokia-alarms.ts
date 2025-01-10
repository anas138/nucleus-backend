import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNokiaAlarms1732771859703 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE nokia_txn_alarm (
    id int(11) NOT NULL AUTO_INCREMENT,
    nokia_alarm_id varchar(255) DEFAULT NULL,
    category varchar(255) NOT NULL,
    event_time timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    severity enum('critical','major','minor','warning') NOT NULL,
    alarm_name varchar(255) NOT NULL,
    alarm_type varchar(255) NOT NULL,
    probable_cause varchar(255) NOT NULL,
    additional_text text DEFAULT NULL,
    affected_object text DEFAULT NULL,
    affected_object_name varchar(255) NOT NULL,
    affected_object_type varchar(255) NOT NULL,
    ne_name varchar(255) NOT NULL,
    ne_ip_address varchar(255) NOT NULL,
    frequency int(11) NOT NULL,
    number_of_occurances int(11) NOT NULL,
    first_time_detected timestamp NOT NULL DEFAULT current_timestamp(),
    source_type varchar(255) NOT NULL,
    impact int(11) NOT NULL,
    last_time_detected timestamp NOT NULL DEFAULT current_timestamp(),
    service_affecting tinyint(1) DEFAULT NULL,
    region_id int(11) DEFAULT NULL,
    record_status enum('ACTIVE','INACTIVE','DELETED','DRAFT') NOT NULL DEFAULT 'ACTIVE',
    created_on datetime DEFAULT NULL,
    cleared_on datetime DEFAULT NULL,
    ne_nokia_id int(11) DEFAULT NULL,
    nokia_txn_last_modified datetime DEFAULT NULL,
    alarm_filter_config_id int(11) DEFAULT NULL,
    is_cleared tinyint(4) NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT current_timestamp(),
    updated_at timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (id),
    KEY nokia_txn_alarm_alarm_filter_config_id (alarm_filter_config_id),
    KEY nokia_txn_alarm_nokia_txn_network_element_id (ne_nokia_id),
    CONSTRAINT nokia_txn_alarm_alarm_filter_config_fk FOREIGN KEY (alarm_filter_config_id) REFERENCES alarm_filter_config (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT nokia_txn_alarm_nokia_txn_network_element_fk FOREIGN KEY (ne_nokia_id) REFERENCES nokia_txn_network_element (id) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
