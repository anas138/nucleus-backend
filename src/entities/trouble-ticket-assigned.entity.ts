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
export class TroubleTicketAssigned {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TroubleTicket, (troubleTicket) => troubleTicket.id)
  @JoinColumn({ name: 'trouble_ticket_id' })
  troubleTicket: TroubleTicket;
  @Column()
  trouble_ticket_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'assigned_to_id' })
  assignedToUser: User;
  @Column({ type: 'number', nullable: true })
  assigned_to_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'assigned_from_id' })
  assignedFromUser: User;
  @Column({ type: 'number' })
  assigned_from_id: number;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'from_sub_department_id' })
  fromSubDepartment: SubDepartment;
  @Column({ type: 'number' })
  from_sub_department_id: number;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'to_sub_department_id' })
  toSubDepartment: User;
  @Column({ type: 'number' })
  to_sub_department_id: number;

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
