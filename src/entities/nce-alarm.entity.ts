import {
  APP_CONSTANTS,
  NCE_ALARM_SEVERITY_DB_ENUM,
} from 'src/common/enums/enums';
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
import { Region } from './region.entity';
import { NceNetworkElement } from './nce-network-element.entity';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { TroubleTicket } from './trouble-ticket.entity';

@Entity()
export class NceAlarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: NCE_ALARM_SEVERITY_DB_ENUM })
  @Index('idx_severity')
  severity: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  event_type: string;

  @Column({ type: 'int', nullable: true })
  nce_alarm_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alarm_text: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alarm_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  layer: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  md_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  alarm_serial_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  native_probable_cause: string;

  @Column({ type: 'text', nullable: true })
  probable_cause: string;

  @Column({ type: 'text', nullable: true })
  location_info: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ne_name: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  ne_resource_id: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  ltp_resource_id: string;

  @Column({
    type: 'enum',
    enum: APP_CONSTANTS.NCE_ALARM_RESOURCE_TYPES,
  })
  resource_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  product_type: string;

  @Column({ type: 'text', nullable: true })
  other_info: string;

  @Column({ type: 'text', nullable: true })
  impacted_resource: string;

  @Column({ type: 'text', nullable: true })
  trail_name: string;

  @Column({ type: 'text', nullable: true })
  fiber_name: string;

  @Column({ type: 'text', nullable: true })
  ason_obj_name: string;

  @Column({ type: 'datetime', nullable: true })
  @Index('idx_created_on')
  created_on: Date;

  @Column({ type: 'datetime', nullable: true })
  @Index('idx_cleared_on')
  cleared_on: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  last_changed_on: Date;

  @Column({ type: 'boolean', default: false })
  is_cleared: boolean;

  @Column({ type: 'datetime', nullable: true })
  acknowledged_on: Date;

  @VirtualColumn({ query: (alias) => 'true' })
  is_seen: boolean;

  @ManyToOne(
    () => NceNetworkElement,
    (networkElement) => networkElement.alarms,
    { persistence: false },
  )
  @JoinColumn({ name: 'ne_resource_id' })
  network_element: NceNetworkElement;

  @Column({ nullable: true })
  alarm_filter_config_id: number;

  @ManyToOne(() => AlarmFilterConfig, { nullable: true })
  @JoinColumn({ name: 'alarm_filter_config_id' })
  alarm_filter_config: AlarmFilterConfig;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(
    () => TroubleTicket,
    (troubleTicket) => troubleTicket.alarmDetailNce,
  )
  troubleTicket: TroubleTicket;
}
