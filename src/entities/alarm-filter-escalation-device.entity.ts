import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RecordStatus } from 'src/common/enums/enums';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { ObserviumDevice } from './obs-device.entity';
import { NceAlarm } from './nce-alarm.entity';

@Entity()
export class AlarmFilterEscalationDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  alarm_filter_config_id: number;
  @JoinColumn({ name: 'alarm_filter_config_id' })
  @ManyToOne(
    () => AlarmFilterConfig,
    (alarmFilterConfig) => alarmFilterConfig.id,
  )
  alarmFilterConfig: AlarmFilterConfig;

  @Column({ type: 'varchar' })
  app_type: string;

  @Column({ nullable: true, default: null })
  nce_device_id: string;

  @Column({ nullable: true, default: null })
  obs_device_id: number;

  @Column({ nullable: true, default: null })
  nokia_device_id: string;

  @Column({ nullable: true, default: null })
  nce_gpon_device_id: string;

  @Column({ nullable: true, default: null })
  ldi_softswitch_trunk_group_id: number;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
