import { RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UploadFile } from './upload-file.entity';
import { TroubleTicket } from './trouble-ticket.entity';

@Entity()
export class UploadFileMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  document_type: string;

  @Column({ nullable: false })
  related_id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  related_type: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @ManyToOne(() => TroubleTicket, (troubleTicket) => troubleTicket.id, {
    persistence: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'related_id' })
  troubleTicket: TroubleTicket;

  @OneToOne(() => UploadFile)
  @JoinColumn({ name: 'upload_file_id' })
  upload_file_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
