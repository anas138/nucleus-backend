import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecordStatus } from 'src/common/enums/enums';
import { TroubleTicket } from './trouble-ticket.entity';
import { User } from './user.entity';
import { SubDepartment } from './sub-department.entity';

@Entity()
export class TroubleTicketPause {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TroubleTicket, (troubleTicket) => troubleTicket.id)
  @JoinColumn({ name: 'trouble_ticket_id' })
  troubleTicket: TroubleTicket;
  @Column()
  trouble_ticket_id: number;

  @Column({ default: null })
  pause_start_time: Date;

  @Column({ default: null })
  pause_end_time: Date;

  @Column()
  pause_reason: string;

  @Column()
  is_approved: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'approved_by' })
  approvedBy: User;
  @Column({ nullable: true })
  approved_by: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'paused_by' })
  pausedBy: User;
  @Column()
  paused_by: number;

  @Column({ nullable: true })
  total_paused_duration: number;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'sub_department_id' })
  subDepartment: SubDepartment;
  @Column()
  sub_department_id: number;

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
