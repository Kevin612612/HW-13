import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customValidation', async: false })
export class CustomValidation implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    return value >= 1; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    return `${args} is less than 1`;
  }
}