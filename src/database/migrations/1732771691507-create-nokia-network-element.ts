import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNokiaNetworkElement1732771691507
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
   await queryRunner.query(`
        CREATE TABLE nokia_txn_network_element (
            id int(11) NOT NULL,
            id_class int(11) NOT NULL,
            alarm_syntesis varchar(255) DEFAULT NULL,
            ason_ctr_plane_type varchar(255) DEFAULT NULL,
            ct_access_status varchar(255) DEFAULT NULL,
            comment1 text DEFAULT NULL,
            comment2 text DEFAULT NULL,
            communication_state varchar(255) DEFAULT NULL,
            eth_present varchar(255) DEFAULT NULL,
            hierarchy_subnet varchar(255) DEFAULT NULL,
            is_multi_nes varchar(255) DEFAULT NULL,
            localization varchar(255) DEFAULT NULL,
            latitude varchar(50) DEFAULT NULL,
            longitude varchar(50) DEFAULT NULL,
            altitude varchar(255) DEFAULT NULL,
            mib_alignment_state varchar(255) DEFAULT NULL,
            ne_alignment varchar(255) DEFAULT NULL,
            ne_sub_type varchar(255) DEFAULT NULL,
            \`key\` varchar(255) DEFAULT NULL,  
            loopback_ip varchar(255) DEFAULT NULL,
            secondary_address varchar(255) DEFAULT NULL,
            class_name varchar(255) DEFAULT NULL,
            otn_conf_downld_st varchar(255) DEFAULT NULL,
            parent_id int(11) DEFAULT NULL,
            parent_label varchar(255) DEFAULT NULL,
            position varchar(255) DEFAULT NULL,
            sdh_present varchar(255) DEFAULT NULL,
            supervision_state varchar(255) DEFAULT NULL,
            gui_label varchar(255) DEFAULT NULL,
            version varchar(255) DEFAULT NULL,
            wdm_present varchar(255) DEFAULT NULL,
            conf_downld_st varchar(255) DEFAULT NULL,
            nad_string varchar(255) DEFAULT NULL,
            product_name varchar(255) DEFAULT NULL,
            reachable varchar(255) DEFAULT NULL,
            short_product_name varchar(255) DEFAULT NULL,
            site_name varchar(255) DEFAULT NULL,
            node_type varchar(255) DEFAULT NULL,
            eml_ne_type varchar(255) DEFAULT NULL,
            comment3 text DEFAULT NULL,
            association_present varchar(255) DEFAULT NULL,
            ne_sub_release varchar(255) DEFAULT NULL,
            associated_ptn_ne_id varchar(255) DEFAULT NULL,
            comments text DEFAULT NULL,
            actual_release varchar(255) DEFAULT NULL,
            audit_status varchar(255) DEFAULT NULL,
            new_communication_state varchar(255) DEFAULT NULL,
            new_supervision_state varchar(255) DEFAULT NULL,
            alignment_state varchar(255) DEFAULT NULL,
            creation_date datetime DEFAULT NULL,
            modified_date datetime DEFAULT NULL,
            created_by varchar(255) DEFAULT NULL,
            modified_by varchar(255) DEFAULT NULL,
            latest_note text DEFAULT NULL,
            scheduled_for_gri varchar(255) DEFAULT NULL,
            system_abnormal_state varchar(244) DEFAULT NULL,
            system_mode varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
