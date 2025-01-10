import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class EmailLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  subject: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  to: string;

  @Column({ type: 'text', nullable: true })
  cc: string;

  @Column({ type: 'text', nullable: true })
  html_body: string;

  @Column({ type: 'varchar', nullable: true })
  from: string;

  @Index()
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
