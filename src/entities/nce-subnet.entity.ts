import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NceSubnet {
  @PrimaryColumn({ type: 'varchar' })
  res_id: string;

  @Column({ nullable: true })
  x_pos: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  ref_parent_subnet: string;

  @Column({ nullable: true })
  y_pos: number;

  @Column({ nullable: true })
  type_id: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true })
  node_class: string;
}
