import { IsNotEmpty, IsNumber } from "class-validator";

export class AlarmRelevantUserQueryParams_DTO{
    @IsNotEmpty()
    @IsNumber()
    alarm_id: number
}