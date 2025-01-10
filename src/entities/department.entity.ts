import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { SubDepartment } from './sub-department.entity';
import { User } from './user.entity';
import { RecordStatus } from 'src/common/enums/enums';
import { Role } from './role.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'department_role',
  })
  roles: Role[];

  @OneToMany(() => SubDepartment, (subDepartment) => subDepartment.department)
  sub_departments: SubDepartment[];

  @OneToMany(() => User, (user) => user.department)
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
