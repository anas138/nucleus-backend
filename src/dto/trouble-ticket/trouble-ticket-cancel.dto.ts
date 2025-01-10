import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class TroubleTicketCancelDto {
  updated_by: number;

  @IsNotEmpty()
  @IsNumber()
  cancelReason: number;

  @IsString()
  comment: string;
}
