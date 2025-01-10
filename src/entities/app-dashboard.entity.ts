import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RecordStatus, AppType, NetworkType } from 'src/common/enums/enums';
import { AppDashboardWidget } from './app-dashboard-widgets.entity';
import { User } from './user.entity';

@Entity()
export class AppDashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ nullable: false, default: true })
  is_shared: boolean;

  @Column({ type: 'enum', enum: AppType, nullable: false })
  app_type: AppType;

  @Column({ type: 'enum', enum: NetworkType, nullable: false })
  network_type: NetworkType;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @OneToMany(
    () => AppDashboardWidget,
    (appDashboardWidget) => appDashboardWidget.appDashboard,
  )
  @JoinColumn({ name: 'app_dashboard_id' })
  app_dashboard_widget: AppDashboardWidget[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_default: boolean;

  @Column({ nullable: true, default: null })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
