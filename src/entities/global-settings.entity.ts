import {
  GlobalSettingsValuesDatatype,
  RecordStatus,
} from 'src/common/enums/enums';
import { GlobalSettingsTypes } from './global-setting-types.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class GlobalSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  global_setting_type_id: number;
  @ManyToOne(
    () => GlobalSettingsTypes,
    (globalSettingsTypes) => globalSettingsTypes.id,
  )
  @JoinColumn({ name: 'global_setting_type_id' })
  globalSettingsType: GlobalSettingsTypes;

  @Column({ type: 'varchar', nullable: false })
  condition_value: string;

  @Column({ type: 'varchar', nullable: false })
  key: string;

  @Column({ type: 'text', nullable: false })
  value: string;

  @Column({
    type: 'enum',
    enum: GlobalSettingsValuesDatatype,
    nullable: false,
  })
  value_datatype: string;

  @Column({ type: 'enum', enum: RecordStatus, default: RecordStatus.ACTIVE })
  record_status: string;

  @Column({ default: 1, nullable: false })
  sequence: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
