import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { RecordStatus } from 'src/common/enums/enums';

@Entity()
export class Segment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 550, nullable: true, default: null })
  description: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @ManyToMany(() => User, (user) => user.segments)
  @JoinTable({ name: 'user_segment' })
  users: User[];

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
