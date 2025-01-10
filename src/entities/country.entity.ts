import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { RecordStatus } from 'src/common/enums/enums';
import { City } from './city.entity';
import { Province } from './province.entity';

@Entity()
export class Country {
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

  @OneToMany(() => City, (city) => city.id)
  @JoinColumn({ name: 'country_id' })
  cities: City[];

  @OneToMany(() => Province, (province) => province.country_id)
  @JoinColumn({ name: 'country_id' })
  provinces: Province[];

  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
