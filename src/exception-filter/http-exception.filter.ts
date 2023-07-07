import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const ctx = host.switchToHttp();
    const request =  ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    switch (status) {
      case HttpStatus.NOT_FOUND:
        const errorResponseNotFound = { errorsMessages: [] };
        const responseBodyNotFound: any = exception.getResponse();
        console.log(exception);
        console.log(responseBodyNotFound);
        
        responseBodyNotFound.message.forEach(mes => {
          errorResponseNotFound.errorsMessages.push(mes);
        });
        response.status(status).json(errorResponseNotFound);
        break;
        
      case HttpStatus.UNAUTHORIZED:
        response.status(status).json({ message: 'Unauthorized' });
        break;

      //PIPE VALIDATION: INPUT DATA ARE NOT SATISFIED TO VALIDATION IN DTO SCHEMA
      case HttpStatus.BAD_REQUEST:
        const errorResponse = { errorsMessages: [] };
        const responseBody: any = exception.getResponse();
        console.log(responseBody);
        
        responseBody.message.forEach(mes => {
          errorResponse.errorsMessages.push(mes);
        });
        response.status(status).json(errorResponse);
        break;

      default:
        const result = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
        response.status(status).json(result);
        break;
    }
  }

}
