import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: Logger = new Logger('Origin')
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, ip } = request;

    this.logger.log(`Incoming Request: ${method} ${url}, IP: ${ip}, User-Agent: ${headers['user-agent']}`)

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        this.logger.log(`Outgoing Response: Status Code: ${statusCode}, Response Time: ${Date.now() - now}ms`)
      }),
      map((data) => {
        let responseData = JSON.stringify(data);
        this.logger.log(`Outgoing Response Data: ${responseData}`);
        return data;
      }),
    );
  }
}
