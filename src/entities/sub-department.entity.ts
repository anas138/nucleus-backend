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
import { Department } from './department.entity';
import { User } from './user.entity';
import { RecordStatus } from 'src/common/enums/enums';

@Entity()
export class SubDepartment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @Column()
  department_id: number;

  @ManyToOne(() => Department, (department) => department.sub_departments)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany(() => User, (user) => user.sub_department)
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
