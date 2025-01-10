import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Region } from './region.entity';
import { NceAlarm } from './nce-alarm.entity';
import { NceSubnet } from './nce-subnet.entity';

@Entity()
export class NceNetworkElement {
  @PrimaryColumn({ length: 40 })
  resource_id: string;

  @Column({ nullable: true })
  is_virtual: boolean;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  is_gateway: number;

  @Column({ nullable: true })
  is_in_ac_domain: boolean;

  @Column({ nullable: true })
  physical_id: number;

  @Column({ nullable: true })
  container: boolean;

  @Column({ nullable: true })
  patch_version: string;

  @Column({ nullable: true })
  pre_config: number;

  @Column({ nullable: true })
  product_name: string;

  @Column({ nullable: true })
  user_label: string;

  @Column({ nullable: true })
  ref_parent_subnet: string;

  @Column({ nullable: true })
  software_version: string;

  @Column('text', { nullable: true })
  gateway_id_list: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  remark: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  hardware_version: string;

  @Column({ nullable: true })
  detail_dev_type_name: string;

  @Column({ nullable: true })
  communication_state: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ nullable: true })
  enable_ason: number;

  @Column({ nullable: true })
  admin_status: string;

  @Column({ nullable: true })
  nce_create_time: Date;

  @Column({ nullable: true })
  nce_last_modified: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_on: Date;

  @Column({ nullable: true })
  region_id: number;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @Column({ type: 'varchar', nullable: true })
  ne_reference_id: string;

  @OneToMany(() => NceAlarm, (nceAlarm) => nceAlarm.network_element)
  @JoinColumn({ name: 'device_id' })
  alarms: NceAlarm[];

  @ManyToOne(() => NceSubnet)
  @JoinColumn({ name: 'ref_parent_subnet' })
  parent_subnet: NceSubnet;
}
