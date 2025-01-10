import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Department } from './department.entity';
import { SubDepartment } from './sub-department.entity';

import { RecordStatus, UserType } from 'src/common/enums/enums';

import { User } from './user.entity';

@Entity()
export class UserSubdepartmentMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  sub_department_id: number;

  @Column()
  department_id: number;

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'sub_department_id' })
  subDepartment: SubDepartment;

  @ManyToOne(() => Department, (department) => department.id)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
