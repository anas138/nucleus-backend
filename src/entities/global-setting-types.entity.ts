import { RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class GlobalSettingsTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  constant: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: RecordStatus, default: RecordStatus.ACTIVE })
  record_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
