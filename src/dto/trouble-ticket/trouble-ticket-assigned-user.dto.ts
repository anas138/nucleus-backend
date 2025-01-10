import { IsNumber, IsOptional } from 'class-validator';

export class TroubleTicketAssignedUserDto {
  @IsOptional()
  @IsNumber()
  updated_by: number;
}
