import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Table,
} from 'typeorm';

import { RecordStatus } from 'src/common/enums/enums';
import { TroubleTicket } from './trouble-ticket.entity';
import { User } from './user.entity';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { ObserviumAlert } from './obs-alert.entity';
import { DropDownItem } from './drop-down-item.entity';

@Entity('trouble_ticket_outage_alarms')
export class AccumulatedTroubleTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TroubleTicket, (troubleTicket) => troubleTicket.id)
  @JoinColumn({ name: 'ticket_id' })
  troubleTicket: TroubleTicket;

  @Column({ type: 'int', nullable: false })
  ticket_id: number;

  @ManyToOne(
    () => AlarmFilterConfig,
    (alarmFilterConfig) => alarmFilterConfig.id,
  )
  @JoinColumn({ name: 'alarm_config_id' })
  alarmFilterConfig: AlarmFilterConfig;

  @Column({ type: 'int' })
  alarm_config_id: number;

  @ManyToOne(() => ObserviumAlert, (observiumAlert) => observiumAlert.id)
  @JoinColumn({ name: 'alarm_id' })
  observiumAlert: ObserviumAlert;

  @Column({ type: 'int' })
  alarm_id: number;

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

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
