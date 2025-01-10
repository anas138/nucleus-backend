import { RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DropDownItem } from './drop-down-item.entity';

@Entity()
export class DropDownCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  constant: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => DropDownItem, (dropDownItem) => dropDownItem.dd_category)
  dd_items: DropDownItem[];
}
