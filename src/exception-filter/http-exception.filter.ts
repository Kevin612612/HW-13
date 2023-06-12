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
        response.status(status).json({
          message: "blog doesn't exist",
          field: 'blogId',
        });
        break;
      case HttpStatus.UNAUTHORIZED:
        response.status(status).json({ message: 'Unauthorized' });
        break;
      //PIPE VALIDATION: INPUT DATA ARE NOT SATISFIED TO VALIDATION IN DTO SCHEMA
      case HttpStatus.BAD_REQUEST:
        const errorResponse = { errors: [] };
        const responseBody: any = exception.getResponse();
        responseBody.message.forEach(mes => {
          errorResponse.errors.push(mes);
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
