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
import { RecordStatus } from 'src/common/enums/enums';
import { User } from './user.entity';
import { SubDepartment } from './sub-department.entity';
import { AlarmFilterConfig } from './alarm-filter-config.entity';

@Entity()
@Unique([
  'alarm_filter_config_id',
  'group_user_id',
  'single_user_id',
  'sub_department_id',
])
export class AlarmRecipient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  recipient_type: string;

  @Column()
  alarm_filter_config_id: number;

  @Column({ nullable: true })
  group_user_id: number;

  @Column({ nullable: true })
  single_user_id: number;

  @Column({ nullable: true })
  sub_department_id: number;

  @ManyToOne(() => AlarmFilterConfig)
  @JoinColumn({ name: 'alarm_filter_config_id' })
  alarm_filter_config: AlarmFilterConfig;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'group_user_id' })
  group_user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'single_user_id' })
  single_user: User;

  @ManyToOne(() => SubDepartment)
  @JoinColumn({ name: 'sub_department_id' })
  sub_department: SubDepartment;

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
