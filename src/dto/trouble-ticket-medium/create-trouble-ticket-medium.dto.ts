import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecordStatus } from 'src/common/enums/enums';
import { IsString, MaxLength, MinLength } from 'class-validator';

@Entity()
export class CreateTroubleTicketMediumDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
}
