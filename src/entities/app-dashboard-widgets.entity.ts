import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecordStatus, WidgetType } from 'src/common/enums/enums';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { AppDashboard } from './app-dashboard.entity';
import { User } from './user.entity';
import { DropDownItem } from './drop-down-item.entity';

@Entity()
export class AppDashboardWidget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'widget_type_id' })
  widgetType: DropDownItem;

  @Column()
  widget_type_id: number;

  @Column({ default: true })
  is_shared: boolean;

  @ManyToOne(
    () => AppDashboard,
    (appDashboard) => appDashboard.app_dashboard_widget,
  )
  @JoinColumn({ name: 'app_dashboard_id' })
  appDashboard: AppDashboard;

  @Column()
  app_dashboard_id: number;

  @ManyToOne(
    () => AlarmFilterConfig,
    (alarmFilterConfig) => alarmFilterConfig.id,
  )
  @JoinColumn({ name: 'alarm_config_id' })
  alarmFilterConfig: AlarmFilterConfig;

  @Column()
  alarm_config_id: number;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  user: User;
  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  sequence: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
