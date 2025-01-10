import { Optional } from '@nestjs/common';

export class PortBitsGraphDto {
  @Optional()
  period: number;

  @Optional()
  from: number;

  @Optional()
  to: number;

  @Optional()
  height: number;

  @Optional()
  width: number;
}
