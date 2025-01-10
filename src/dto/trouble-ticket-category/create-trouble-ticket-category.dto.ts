import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RecordStatus, TatUot } from 'src/common/enums/enums';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@Entity()
export class CreateTroubleTicketCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  tat: number;

  @IsEnum(TatUot)
  tat_uom: TatUot;

  @IsOptional()
  @IsNumber()
  parent_id: number;
}
