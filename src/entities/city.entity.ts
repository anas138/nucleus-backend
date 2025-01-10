import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Index,
  Unique,
} from 'typeorm';
import { RecordStatus } from 'src/common/enums/enums';
import { Country } from './country.entity';
import { Region } from './region.entity';
import { Province } from './province.entity';

@Entity()
@Unique(['name', 'province_id', 'country_id'])
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  name: string;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @Column()
  country_id: number;

  @Column({ nullable: true })
  region_id: number;

  @Column()
  province_id: number;

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @ManyToOne(() => Province, (province) => province.cities)
  @JoinColumn({ name: 'province_id' })
  province: Province;

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
