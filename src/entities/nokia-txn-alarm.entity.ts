import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';
import { NokiaTxnNetworkElement } from './nokia-txn-network-element.entity';

@Entity('nokia_txn_alarm')
export class NokiaTxnAlarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nokia_alarm_id: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'timestamp' })
  event_time: Date;

  @Column({ type: 'enum', enum: ['critical', 'major', 'minor', 'warning'] })
  severity: 'critical' | 'major' | 'minor' | 'warning';

  @Column({ type: 'varchar', length: 255 })
  alarm_name: string;

  @Column({ type: 'varchar', length: 255 })
  alarm_type: string;

  @Column({ type: 'varchar', length: 255 })
  probable_cause: string;

  @Column({ type: 'text', nullable: true })
  additional_text: string;

  @Column({ type: 'text', nullable: true })
  affected_object: string;

  @Column({ type: 'varchar', length: 255 })
  affected_object_name: string;

  @Column({ type: 'varchar', length: 255 })
  affected_object_type: string;

  @Column({ type: 'varchar', length: 255 })
  ne_name: string;

  @Column({ type: 'varchar', length: 255 })
  ne_ip_address: string;

  @Column({ type: 'int' })
  frequency: number;

  @Column({ type: 'int' })
  number_of_occurances: number;

  @Column({ type: 'timestamp' })
  first_time_detected: Date;

  @Column({ type: 'varchar', length: 255 })
  source_type: string;

  @Column({ type: 'int' })
  impact: number;

  @Column({ type: 'timestamp' })
  last_time_detected: Date;

  @Column({ type: 'boolean', nullable: true })
  service_affecting: boolean;

  @Column({ type: 'int', nullable: true })
  region_id: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'DELETED', 'DRAFT'],
    default: 'ACTIVE',
  })
  record_status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'DRAFT';

  @Column({ type: 'datetime', nullable: true })
  created_on: Date;

  @Column({ type: 'datetime', nullable: true })
  cleared_on: Date;

  @Column({ type: 'int', nullable: true })
  ne_nokia_id: number;

  @Column({ nullable: true, default: null })
  nokia_txn_last_modified: Date;

  @Column()
  alarm_filter_config_id: number;

  @Column({ nullable: false, default: false })
  is_cleared: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => AlarmFilterConfig,
    (alarmFilterConfig) => alarmFilterConfig.id,
  )
  @JoinColumn({ name: 'alarm_filter_config_id' })
  alarm_filter_config: AlarmFilterConfig;

  @ManyToOne(
    () => NokiaTxnNetworkElement,
    (nokiaTxnNetworkElement) => nokiaTxnNetworkElement.id,
  )
  @JoinColumn({ name: 'ne_nokia_id' })
  nokiaTxnNetworkElement: NokiaTxnNetworkElement;
}
