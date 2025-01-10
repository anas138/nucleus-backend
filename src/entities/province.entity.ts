import { RecordStatus } from 'src/common/enums/enums';
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
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  name: string;

  @Column()
  country_id: number;

  @ManyToOne(() => Country, (country) => country.id)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => City, (city) => city.id)
  @JoinColumn({ name: 'province_id' })
  cities: City[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
