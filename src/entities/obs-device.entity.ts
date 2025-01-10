import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ObserviumAlert } from './obs-alert.entity';
import { Region } from './region.entity';
import { City } from './city.entity';

@Entity()
export class ObserviumDevice {
  @Column({ primary: true, nullable: false, unique: true })
  device_id: number;

  @Column({ nullable: true })
  poller_id: string;

  @Column({ nullable: true })
  hostname: string;

  @Column({ nullable: true })
  sys_name: string;

  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  snmp_community: string;

  @Column({ nullable: true })
  snmp_version: string;

  @Column({ nullable: true })
  snmp_port: string;

  @Column({ nullable: true })
  ssh_port: string;

  @Column({ nullable: true })
  agent_version: string;

  @Column({ nullable: true })
  snmp_transport: string;

  @Column({ nullable: true })
  snmp_engine_id: string;

  @Column({ nullable: true })
  sys_object_id: string;

  @Column({ nullable: true })
  sys_descr: string;

  @Column({ nullable: true })
  sys_contact: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  hardware: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  features: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  os: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  status_type: string;

  @Column({ nullable: true })
  ignore: string;

  @Column({ nullable: true })
  disabled: string;

  @Column({ nullable: true })
  purpose: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  serial: string;

  @Column({ nullable: true })
  location_id: string;

  @Column({ nullable: true })
  location_lat: string;

  @Column({ nullable: true })
  location_lon: string;

  @Column({ nullable: true })
  location_country: string;

  @Column({ nullable: true })
  location_state: string;

  @Column({ nullable: true })
  location_county: string;

  @Column({ nullable: true })
  location_city: string;

  @Column({ nullable: true })
  location_manual: string;

  @Column({ nullable: true })
  discover_lsp: string;

  @Column({ nullable: true })
  discover_services: string;

  @Column({ nullable: true })
  enable_ports_adsl: string;

  @Column({ nullable: true })
  enable_ports_etherlike: string;

  @Column({ nullable: true })
  enable_ports_fdbcount: string;

  @Column({ nullable: true })
  override_sys_location_bool: string;

  @Column({ nullable: true })
  override_sys_location_string: string;

  @Column({ nullable: true })
  region_id: number;

  @Column({ nullable: true })
  city_id: number;

  @OneToMany(() => ObserviumAlert, (observiumAlert) => observiumAlert.device_id)
  @JoinColumn({ name: 'device_id' })
  alerts: ObserviumAlert[];

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @ManyToOne(() => City, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;
}
