import { RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LdiSoftswitchTrunkGroup } from './ldi-softswitch-trunk-group.entity';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { DropDownItem } from './drop-down-item.entity';

@Entity()
export class LdiSoftswitchEmsAlarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ems_alarm_id: string;

  @Column()
  category: string;

  @Column()
  event_time: string;

  @Column()
  source_ip: string;

  @Column()
  severity: string;

  @Column()
  class_txt: string;

  @Column()
  syslog_ip: string;

  @Column()
  syslog_source: string;

  @Column()
  error_code: string;

  @Index()
  @Column()
  message: string;

  @Column()
  message_state: string;

  @Index()
  @Column()
  trunk_group: string;

  @Column()
  type_txt: string;

  @Column()
  subtype_txt: string;

  @Column()
  ldi_softswitch_trunk_group_id: number;

  @Column()
  alarm_filter_config_id: number;

  @Column({ type: 'boolean', default: false })
  is_cleared: boolean;

  @Column({ type: 'datetime', nullable: true })
  created_on: Date;

  @Column({ type: 'datetime', nullable: true })
  cleared_on: Date;

  @Index()
  @Column()
  alarm_type: number;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    nullable: true,
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

  @ManyToOne(
    () => LdiSoftswitchTrunkGroup,
    (ldiSoftswitchTrunkGroup) => ldiSoftswitchTrunkGroup.id,
  )
  @JoinColumn({ name: 'ldi_softswitch_trunk_group_id' })
  ldiSoftswitchTrunkGroup: LdiSoftswitchTrunkGroup;

  @ManyToOne(() => AlarmFilterConfig, { nullable: true })
  @JoinColumn({ name: 'alarm_filter_config_id' })
  alarm_filter_config: AlarmFilterConfig;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'alarm_type' })
  alarmType: DropDownItem;

  @Column({ type: 'varchar', default: null })
  actual_severity: string;
}
