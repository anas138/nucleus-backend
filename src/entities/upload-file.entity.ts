import { RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UploadFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  original_name: string;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  ext: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mime: string;

  @Column({ type: 'float', nullable: false })
  size: number;

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

  @UpdateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
