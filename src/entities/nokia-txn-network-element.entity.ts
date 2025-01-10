import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('nokia_txn_network_element')
export class NokiaTxnNetworkElement {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column()
  id_class: number;

  @Column({ name: 'alarm_syntesis', type: 'varchar', length: 255 })
  alarm_syntesis: string;

  @Column({ name: 'ason_ctr_plane_type', type: 'varchar', length: 255 })
  ason_ctr_plane_type: string;

  @Column({ name: 'ct_access_status', type: 'varchar', length: 255 })
  ct_access_status: string;

  @Column({ name: 'comment1', type: 'text', nullable: true })
  comment1: string;

  @Column({ name: 'comment2', type: 'text', nullable: true })
  comment2: string;

  @Column({ name: 'communication_state', type: 'varchar', length: 255 })
  communication_state: string;

  @Column({ name: 'eth_present' })
  eth_present: string;

  @Column({ name: 'hierarchy_subnet', type: 'varchar', length: 255 })
  hierarchy_subnet: string;

  @Column({ name: 'is_multi_nes' })
  is_multi_nes: string;

  @Column({ name: 'localization', type: 'varchar', length: 255 })
  localization: string;

  @Column({ name: 'latitude'})
  latitude: string;

  @Column({ name: 'longitude',  })
  longitude: string;

  @Column({ name: 'altitude', type: 'varchar', length: 255 })
  altitude: string;

  @Column({ name: 'mib_alignment_state', type: 'varchar', length: 255 })
  mib_alignment_state: string;

  @Column({ name: 'ne_alignment', type: 'varchar', length: 255 })
  ne_alignment: string;

  @Column({ name: 'ne_sub_type', type: 'varchar', length: 255 })
  ne_sub_type: string;

  @Column({ name: 'key', type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ name: 'loopback_ip', type: 'varchar', length: 255 })
  loopback_ip: string;

  @Column({ name: 'secondary_address', type: 'varchar', length: 255 })
  secondary_address: string;

  @Column({ name: 'class_name', type: 'varchar', length: 255 })
  class_name: string;

  @Column({ name: 'otn_conf_downld_st', type: 'varchar', length: 255 })
  otn_conf_downld_st: string;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parent_id: number;

  @Column({ name: 'parent_label', type: 'varchar', length: 255 })
  parent_label: string;

  @Column({ name: 'position', type: 'varchar', length: 255 })
  position: string;

  @Column({ name: 'sdh_present' })
  sdh_present: string;

  @Column({ name: 'supervision_state', type: 'varchar', length: 255 })
  supervision_state: string;

  @Column({ name: 'gui_label', type: 'varchar', length: 255 })
  gui_label: string;

  @Column({ name: 'version', type: 'varchar', length: 255 })
  version: string;

  @Column({ name: 'wdm_present' })
  wdm_present: string;

  @Column({ name: 'conf_downld_st', type: 'varchar', length: 255 })
  conf_downld_st: string;

  @Column({ name: 'nad_string', type: 'varchar', length: 255 })
  nad_string: string;

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  product_name: string;

  @Column({ name: 'reachable' })
  reachable: string;

  @Column({ name: 'short_product_name', type: 'varchar', length: 255 })
  short_product_name: string;

  @Column({ name: 'site_name', type: 'varchar', length: 255 })
  site_name: string;

  @Column({ name: 'node_type', type: 'varchar', length: 255 })
  node_type: string;

  @Column({ name: 'eml_ne_type', type: 'varchar', length: 255 })
  eml_ne_type: string;

  @Column({ name: 'comment3', type: 'text', nullable: true })
  comment3: string;

  @Column({ name: 'association_present' })
  association_present: string;

  @Column({ name: 'ne_sub_release', type: 'varchar', length: 255 })
  ne_sub_release: string;

  @Column({ name: 'associated_ptn_ne_id', type: 'varchar', length: 255 })
  associated_ptn_ne_id: string;

  @Column({ name: 'comments', type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'actual_release', type: 'varchar', length: 255 })
  actual_release: string;

  @Column({ name: 'audit_status', type: 'varchar', length: 255 })
  audit_status: string;

  @Column({ name: 'new_communication_state', type: 'varchar', length: 255 })
  new_communication_state: string;

  @Column({ name: 'new_supervision_state', type: 'varchar', length: 255 })
  new_supervision_state: string;

  @Column({ name: 'alignment_state', type: 'varchar', length: 255 })
  alignment_state: string;

  @Column({ name: 'creation_date' })
  creation_date: Date;

  @Column({ name: 'modified_date' })
  modified_date: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 255 })
  created_by: string;

  @Column({ name: 'modified_by', type: 'varchar', length: 255 })
  modified_by: string;

  @Column({ name: 'latest_note', type: 'text', nullable: true })
  latest_note: string;

  @Column({ name: 'scheduled_for_gri', type: 'varchar', length: 255 })
  scheduled_for_gri: string;

  @Column({ name: 'system_abnormal_state' })
  system_abnormal_state: string;

  @Column({ name: 'system_mode', type: 'varchar', length: 255 })
  system_mode: string;
}
