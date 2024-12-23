import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter } from 'prom-client';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  private readonly httpRequestCounter: Counter<string>;

  constructor() {
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.httpRequestCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode,
      });
    });
    next();
  }
}