import { BadRequestException } from '@nestjs/common';

export const ValidationPipeOptions = {
  stopAtFirstError: true,
  exceptionFactory: errors => {
    const errorsForResponse = [];
    
    console.log(errors); //array of errors
    // take messages from array of errors an put them into errorsForResponse
    errors.forEach(er => {
      const constraintsKeys = Object.keys(er.constraints);
      constraintsKeys.forEach(ckey => {
        errorsForResponse.push({ message: er.constraints[ckey], field: er.property });
      });
    });

    throw new BadRequestException(errorsForResponse);
  },
};
