import { RecordStatus } from 'src/common/enums/enums';
import {
  Entity,
  Column,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Region } from './region.entity';

@Entity()
export class NceGponNetworkElement {
  @PrimaryColumn({ type: 'varchar', unique: true })
  resource_id: string;

  @Column()
  is_virtual: boolean;

  @Column({ type: 'varchar' })
  lifecycle_state: string;

  @Column({ type: 'varchar' })
  ip_address: string;

  @Column({ type: 'int' })
  is_gateway: number;

  @Column({ type: 'boolean', default: null })
  is_in_ac_domain: boolean;

  @Column({ type: 'varchar' })
  dev_sys_name: string;

  @Column({ type: 'int' })
  physical_id: number;

  @Column({ type: 'boolean', default: false })
  container: boolean;

  @Column({ type: 'varchar' })
  patch_version: string;

  @Column()
  pre_config: number;

  @Column({ type: 'date' })
  manufacture_date: Date;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'varchar' })
  product_name: string;

  @Column({ type: 'varchar' })
  ref_parent_subnet: string;

  @Column({ type: 'varchar' })
  software_version: string;

  @Column({ type: 'varchar' })
  gateway_id_list: string;

  @Column({ type: 'varchar' })
  manufacturer: string;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  hardware_version: string;

  @Column('simple-array')
  roles: string[];

  @Column({ type: 'varchar' })
  detail_dev_type_name: string;

  @Column({ type: 'varchar' })
  communication_state: string;

  @Column({ type: 'varchar' })
  alias: string;

  @Column()
  enable_ason: number;

  @Column({ type: 'varchar' })
  admin_status: string;

  @Column()
  nce_create_time: Date;

  @Column({ type: 'varchar' })
  nce_last_modified: Date;

  @Column()
  created_on: Date;

  @Column()
  region_id: number;

  @Column()
  ne_reference_id: Date;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @ManyToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: 'region_id' })
  region: Region;
}
