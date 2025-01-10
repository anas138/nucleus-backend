import { RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AlarmFilterConfig } from './alarm-filter-config.entity';

@Entity()
@Unique([
  'field_name',
  'field_value',
  'search_criteria',
  'alarm_filter_config_id',
])
export class AlarmFilterAdvanceCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  field_name: string;

  @Column({ type: 'varchar', length: 255 })
  field_value: string;

  @Column({ type: 'varchar', length: 100, default: 'contains' })
  search_criteria: string;

  @Column()
  alarm_filter_config_id: number;

  @ManyToOne(() => AlarmFilterConfig)
  @JoinColumn({ name: 'alarm_filter_config_id' })
  alarm_filter_config: AlarmFilterConfig;

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
