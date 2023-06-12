import { BadRequestException } from '@nestjs/common';

export const ValidationPipeOptions = {
  stopAtFirstError: true,
  exceptionFactory: errors => {
    const errorsForResponse = [];
    
    errors.forEach(er => {
      const constraintsKeys = Object.keys(er.constraints);
      constraintsKeys.forEach(ckey => {
        errorsForResponse.push({ message: er.constraints[ckey], field: er.property });
      });
    });

    throw new BadRequestException(errorsForResponse);
  },
};
