import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

/**
 *  Ref:
 *    switch / case for all exception, ref:  https://stackoverflow.com/a/67556738/16124226
 */
@Catch(QueryFailedError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { driverError, message } = exception;
    Logger.error(message, exception.stack, `${request.method} ${request.url}`);
    Logger.debug(driverError.sql, 'SQL query');

    const errorResponse = {
      path: request.url,
      timestamp: new Date().toISOString(),
      message: message,
    };
    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
