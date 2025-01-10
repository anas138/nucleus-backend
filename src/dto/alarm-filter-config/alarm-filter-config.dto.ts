import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { AppType, RecordStatus } from 'src/common/enums/enums';
import { AuditDto } from '../audit.dto';

export class AlarmFilterConfigDto extends AuditDto {
  @IsEnum(AppType)
  @IsNotEmpty()
  app_type: AppType;

  @IsString()
  @IsNotEmpty()
  alarm_name: string;

  @IsString()
  @IsNotEmpty()
  severity: string;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  is_regional_escalation: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  email_escalation_delay: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  ticket_escalation_delay: number;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  is_email_escalation: boolean;

  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  is_ticket_escalation: boolean;

  @IsOptional()
  @IsEnum(RecordStatus)
  record_status: RecordStatus;

  @IsOptional()
  @IsBoolean()
  @ConditionalFieldsValidator({
    message: 'Validation Error',
  })
  is_change_in_display_severity: boolean;

  @IsOptional()
  @IsString()
  conditional_severity: string;

  @IsOptional()
  @IsString()
  severity_to_be_displayed: string;
}

export function ConditionalFieldsValidator(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ConditionalFieldsValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          if (object.is_change_in_display_severity) {
            return (
              typeof object.conditional_severity === 'string' &&
              object.conditional_severity.trim() !== '' &&
              typeof object.severity_to_be_displayed === 'string' &&
              object.severity_to_be_displayed.trim() !== ''
            );
          }
          if (!object.is_change_in_display_severity) {
            return (
              (object.conditional_severity === null ||
                !object.conditional_severity) &&
              (object.severity_to_be_displayed === null ||
                !object.severity_to_be_displayed)
            );
          }
          return true; // If `is_change_in_display_severity` is false, validation passes.
        },
        defaultMessage(args: ValidationArguments) {
          return `Validation Error`;
        },
      },
    });
  };
}
