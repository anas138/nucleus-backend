import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { RecordStatus, TatUot } from 'src/common/enums/enums';

@Entity()
export class TroubleTicketCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;
  @ManyToOne(
    () => TroubleTicketCategory,
    (troubleTicketCategory) => troubleTicketCategory.id,
  )
  @JoinColumn({ name: 'parent_id' })
  @Column({ nullable: true, default: null })
  parent_id: number;

  @OneToMany(
    () => TroubleTicketCategory,
    (troubleTicketCategory) => troubleTicketCategory.parent_id,
  )
  sub_category: TroubleTicketCategory[];

  @Column()
  tat: number;

  @Column({
    type: 'enum',
    enum: TatUot,
    nullable: false,
    default: TatUot.HOURS,
  })
  tat_uom: TatUot;

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
