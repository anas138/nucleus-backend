import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class NceLtp {
  @PrimaryColumn({ length: 40 })
  resource_id: string;

  @Column({ nullable: true })
  max_wave_num: number;

  @Column({ nullable: true })
  work_band_parity: string;

  @Column({ nullable: true })
  medium_type: string;

  @Column({ nullable: true })
  ltp_type_name: string;

  @Column({ nullable: true })
  is_sub_ltp: boolean;

  @Column({ nullable: true })
  card_id: string;

  @Column({ nullable: true })
  slot_number: string;

  @Column({ nullable: true })
  direction: string;

  @Column({ nullable: true })
  frame_number: string;

  @Column({ nullable: true })
  user_label: string;

  @Column({ nullable: true })
  port_number: number;

  @Column({ nullable: true })
  ne_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ nullable: true })
  is_physical: boolean;

  @Column({ nullable: true })
  ltp_role: string;

  @Column({ nullable: true })
  port_type: number;

  @Column({ nullable: true })
  optics_bom_code: string;

  @Column({ nullable: true })
  sc_ltp_type: string;

  @Column({ nullable: true })
  create_time: Date;

  @Column({ nullable: true })
  last_modified: Date;

  @Column({ nullable: true })
  sn: string;
}
