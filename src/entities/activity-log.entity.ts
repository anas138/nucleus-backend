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

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => TroubleTicket, (troubleTicket) => troubleTicket.activityLog)
  @JoinColumn({ name: 'related_id' })
  troubleTicket: TroubleTicket;

  @Column({ type: 'int', nullable: false })
  related_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  related_table: string;

  @Column({ type: 'varchar' })
  message: string;

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
