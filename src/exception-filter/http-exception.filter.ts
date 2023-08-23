import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { getClassName } from '../secondary functions/getFunctionName';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const status = exception.getStatus();
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		switch (status) {
			case HttpStatus.NOT_FOUND:
				const errorResponseNotFound = { errorsMessages: [] };
				const logger = new Logger(getClassName());
				logger.log(exception.getResponse());
				const responseBodyNotFound: any = exception.getResponse();
				if (Array.isArray(responseBodyNotFound.message)) {
					responseBodyNotFound.message.forEach((mes) => {
						errorResponseNotFound.errorsMessages.push(mes);
					});
					response.status(status).json(errorResponseNotFound); //resource is not found
				} else {
					response.status(status).json(responseBodyNotFound.message); //url is not found
				}
				break;

			case HttpStatus.UNAUTHORIZED:
				response.status(status).json({ message: 'Unauthorized' });
				break;

			case HttpStatus.FORBIDDEN:
				const errorResponseForbidden = { errorsMessages: [] };
				const responseBodyForbidden: any = exception.getResponse();
				responseBodyForbidden.message.forEach((mes) => {
					errorResponseForbidden.errorsMessages.push(mes);
				});
				response.status(status).json(errorResponseForbidden);
				break;

			//PIPE VALIDATION: INPUT DATA ARE NOT SATISFIED TO VALIDATION IN DTO SCHEMA
			case HttpStatus.BAD_REQUEST:
				const errorResponse = { errorsMessages: [] };
				const responseBody: any = exception.getResponse();
				responseBody.message.forEach((mes) => {
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
