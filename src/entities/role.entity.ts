import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { Department } from './department.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 550, nullable: true, default: null })
  description: string;

  @ManyToMany(() => Department, (department) => department.roles)
  @JoinTable({
    name: 'department_role',
  })
  departments: Department[];

  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable({ name: 'user_role' })
  users: User[];

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permission' })
  permissions: Permission[];

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
