import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { NceGponNetworkElement } from './nce-gpon-network-element.entity';
import { RecordStatus } from 'src/common/enums/enums';
import { AlarmFilterConfig } from './alarm-filter-config.entity';

@Entity()
export class NceGponAlarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  ne_name: string;

  @Column({ type: 'varchar' })
  alarm_serial_number: string;

  @Column({ type: 'text' })
  alarm_text: string;

  @Column({ type: 'varchar' })
  severity: string;

  @Column({ type: 'bigint' })
  nce_alarm_id: number;

  @Column({ type: 'varchar' })
  event_type: string;

  @Column({ type: 'varchar' })
  layer: string;

  @Column({ type: 'varchar' })
  md_name: string;

  @Column({ type: 'varchar' })
  product_type: string;

  @Column()
  created_on: Date;

  @Column()
  cleared_on: Date;

  @Column({ type: 'text' })
  native_probable_cause: string;

  @Column({ type: 'text' })
  probable_cause: string;

  @Column({ type: 'varchar' })
  alarm_type_id: string;

  @Column({ type: 'text' })
  location_info: string;

  @Column({ type: 'text' })
  other_info: string;

  @Column({ type: 'varchar' })
  loc_info_frame: string;

  @Column({ type: 'varchar' })
  loc_info_slot: string;

  @Column({ type: 'varchar' })
  loc_info_subslot: string;

  @Column({ type: 'varchar' })
  loc_info_port: string;

  @Column({ type: 'varchar' })
  loc_info_onu_id: string;

  @Column({ type: 'varchar' })
  loc_info_type_id: string;

  @Column({ type: 'varchar' })
  ne_resource_id: string;

  @Column({ type: 'bool', default: false })
  is_cleared: boolean;

  @Column({ type: 'date', default: new Date() })
  last_changed_on: Date;

  @ManyToOne(
    () => NceGponNetworkElement,
    (nceGponNetworkElement) => nceGponNetworkElement.resource_id,
  )
  @JoinColumn({ name: 'ne_resource_id' })
  nceGponNetworkElement: NceGponNetworkElement;

  @Column()
  alarm_filter_config_id: number;
  @ManyToOne(
    () => AlarmFilterConfig,
    (alarmFilterConfig) => alarmFilterConfig.id,
  )
  @JoinColumn({ name: 'alarm_filter_config_id' })
  alarm_filter_config: AlarmFilterConfig;

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
