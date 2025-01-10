import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateAlarmFilterAdvanceConditionDto } from 'src/dto/alarm-filter-config/create-alarm-filter.dto';

@ValidatorConstraint({ async: false })
export class IsArrayUniqueConstraint implements ValidatorConstraintInterface {
  validate(
    value: any[] | CreateAlarmFilterAdvanceConditionDto[],
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const uniqueObjectSet: Set<any | CreateAlarmFilterAdvanceConditionDto> =
      new Set();
    if (!Array.isArray(value)) {
      return false;
    }
    const stringifiedArray = value.map((obj: any) => {
      return JSON.stringify(obj);
    });
    const uniqueStringifiedArray = new Set([...stringifiedArray]);
    if (stringifiedArray.length != uniqueStringifiedArray.size) {
      return false;
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Array must be unique';
  }
}
