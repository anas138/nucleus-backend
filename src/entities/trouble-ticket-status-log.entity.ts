import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { RecordStatus } from 'src/common/enums/enums';
import { TroubleTicket } from './trouble-ticket.entity';
import { DropDownItem } from './drop-down-item.entity';

@Entity()
export class TroubleTicketStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TroubleTicket, (troubleTicket) => troubleTicket.id)
  @JoinColumn({ name: 'trouble_ticket_id' })
  troubleTicket: TroubleTicket;
  @Column({ type: 'number', nullable: false })
  trouble_ticket_id: number;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'status' })
  statusLog: DropDownItem;
  @Column()
  status: number;

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
