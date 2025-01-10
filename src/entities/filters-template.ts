import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { FILTERS_TEMPLATES_TYPE } from 'src/common/enums/enums';
import { User } from './user.entity';

@Entity()
export class FiltersTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FILTERS_TEMPLATES_TYPE,
    default: FILTERS_TEMPLATES_TYPE.DEFAULT,
  })
  template_type: FILTERS_TEMPLATES_TYPE;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  user: User;


  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'text', nullable: true, default: '' })
  comment: string;

  @Column({ type: 'boolean', default: false })
  is_shared: boolean;

  @Column({ type: 'text', nullable: false })
  filters_payload: string;

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
