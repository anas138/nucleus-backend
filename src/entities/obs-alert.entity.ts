import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VirtualColumn,
} from 'typeorm';
import { ObserviumDevice } from './obs-device.entity';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { OBSERVIUM_ALERT_SEVERITY } from 'src/common/enums/enums';
import { TroubleTicket } from './trouble-ticket.entity';

@Entity()
export class ObserviumAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  alert_state: string;

  @Column({ nullable: true })
  alert_status: string;

  @Column({ nullable: true, type: 'enum', enum: OBSERVIUM_ALERT_SEVERITY })
  @Index('idx_alert_severity')
  alert_severity: string;

  @Column({ nullable: true })
  @Index('idx_alert_timestamp')
  alert_timestamp: Date;

  @Column({ nullable: true })
  alert_id: number;

  @Column({ nullable: true })
  alert_message: string;

  @Column({ nullable: true, type: 'text' })
  conditions: string;

  @Column({ nullable: true, type: 'text' })
  metrics: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  entity_name: string;

  @Column({ nullable: true })
  entity_id: number;

  @Column({ nullable: true })
  entity_type: string;

  @Column({ nullable: true })
  entity_description: string;

  @Column({ nullable: true })
  device_hostname: string;

  @Column({ nullable: true })
  device_sysname: string;

  @Column({ nullable: true })
  device_description: string;

  @Column()
  device_id: number;

  @ManyToOne(() => ObserviumDevice, (observiumDevice) => observiumDevice.alerts)
  @JoinColumn({ name: 'device_id' })
  device: ObserviumDevice;

  @Column({ nullable: true })
  device_hardware: string;

  @Column({ nullable: true })
  device_os: string;

  @Column({ nullable: true })
  device_type: string;

  @Column({ nullable: true, type: 'text' })
  device_location: string;

  @Column({ nullable: true })
  device_uptime: string;

  @Column({ nullable: true })
  device_rebooted: Date;

  @Column({ nullable: true, length: 500 })
  title: string;

  @Column({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  @Index('idx_cleared_on')
  cleared_on: Date;

  @Column({ type: 'boolean', default: false })
  is_cleared: boolean;

  @VirtualColumn({ query: (alias) => 'true' })
  is_seen: boolean;

  @Column({ nullable: true })
  alarm_filter_config_id: number;

  @ManyToOne(() => AlarmFilterConfig, { nullable: true })
  @JoinColumn({ name: 'alarm_filter_config_id' })
  alarm_filter_config: AlarmFilterConfig;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  nms_circuit_id: string;

  @OneToOne(
    () => TroubleTicket,
    (troubleTicket) => troubleTicket.alarmDetailObservium,
  )
  troubleTicket: TroubleTicket;
}
