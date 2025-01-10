import { AuthTypes, RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_session')
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  user_id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  token: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ip: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  client: string;

  @Column({ type: 'enum', enum: AuthTypes, nullable: true })
  status: AuthTypes;

  @Column({ type: 'datetime', nullable: true })
  login_time: Date;

  @Column({ type: 'datetime', nullable: true })
  logout_time: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  last_activity_time: Date;
}
