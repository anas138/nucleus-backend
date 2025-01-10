import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DropDownCategory } from './drop-down-category.entity';
import { RecordStatus } from 'src/common/enums/enums';

@Entity()
export class DropDownItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  label: string;

  @Column({ nullable: true })
  sequence: number;

  @Column()
  dd_category_id: number;

  @ManyToOne(
    () => DropDownCategory,
    (dropDownCategory) => dropDownCategory.dd_items,
  )
  @JoinColumn({ name: 'dd_category_id' })
  dd_category: DropDownCategory;

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
}
