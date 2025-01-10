import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Department } from './department.entity';
import { SubDepartment } from './sub-department.entity';
import { Designation } from './designation.entity';
import { Region } from './region.entity';
import { Segment } from './segment.entity';
import { RecordStatus, UserType } from 'src/common/enums/enums';
import { IsOptional } from 'class-validator';
import { UserSubdepartmentMapping } from './user_subdepartment_mapping.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  full_name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 550, nullable: true })
  profile_picture: string;

  @Column({ type: 'varchar', length: 13, nullable: false })
  personal_mobile: string;

  @Column({ type: 'varchar', length: 13, nullable: false })
  official_mobile: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.EMPLOYEE,
  })
  user_type: UserType;

  @Column({ nullable: true })
  sub_department_id: number;

  @Column({ nullable: true })
  department_id: number;

  @Column({ nullable: true })
  designation_id: number;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permission',
  })
  permissions: Permission[];

  @ManyToMany(() => Region)
  @JoinTable({
    name: 'user_region',
  })
  regions: Region[];

  @ManyToMany(() => Segment)
  @JoinTable({
    name: 'user_segment',
  })
  segments: Segment[];

  @ManyToOne(() => Department, (department) => department.users)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.users)
  @JoinColumn({ name: 'sub_department_id' })
  sub_department: SubDepartment;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'reporting_to_role' })
  reporting_to_role: Role;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporting_to_user' })
  reporting_to_user: User;

  @ManyToOne(() => Designation, (designation) => designation.users)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  @Column({ type: 'datetime', nullable: true })
  last_login: Date;

  @Column({ type: 'datetime', nullable: true })
  last_password_changed: Date;

  @Column({ nullable: false, default: false })
  email_activate: boolean;

  @Column({ nullable: false, default: false })
  sms_activate: boolean;

  @Column({ nullable: false, default: false })
  notification_activate: boolean;

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  ms_org_email: string;

  checkPermission(permission: string): any {
    return this.permissions.find((p) => p.name === permission);
  }

  @OneToMany(
    () => UserSubdepartmentMapping,
    (userSubdepartmentMapping) => userSubdepartmentMapping.user,
  )
  userDepartments: UserSubdepartmentMapping[];
}
