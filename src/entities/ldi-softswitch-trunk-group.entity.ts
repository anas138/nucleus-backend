import { RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LdiSoftswitchTrunkGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trunk_name: string;

  @Column()
  peer_end_ip: string;

  @Column()
  ldi_ip: string;

  @Column()
  status: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    nullable: true,
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
