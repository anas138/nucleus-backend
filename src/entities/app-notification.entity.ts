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
export class AppNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  related_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  related_table: string;

  @Column({ type: 'varchar', default: 'New Notification' })
  title: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ nullable: true, default: null })
  user_id: number;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'sub_department_id' })
  subDepartment: SubDepartment;
  @Column({ nullable: true, default: null })
  sub_department_id: number;

  @Column()
  is_seen: Boolean;

  @Column()
  is_open: Boolean;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
