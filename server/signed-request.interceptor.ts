import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestMethod,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class SignedRequestInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if(context.switchToHttp().getRequest<Request>().method !== 'POST') {
      return next.handle();
    }
    const body = context.switchToHttp().getRequest<Request>().body;
    console.log('SignedRequestInterceptor: Body is', body);
    return this.checkAuthenticated(body).pipe(
      switchMap((decoded) => {
        // tslint:disable-next-line: no-string-literal
        return of(context.switchToHttp().getRequest<Request>()['auth'] = decoded);
      }),
      switchMap(() => {
        return next.handle().pipe(tap((d) => console.log(d)));
      })
    );
    return next.handle().pipe(tap((d) => console.log(d)));
  }
  checkAuthenticated(body: any): Observable<any> {
    const bodyArray = body.signed_request.split('.');
    const consumerSecret = bodyArray[0];
    const encoded_envelope = bodyArray[1];
    const consumerSecretApp = this.configService.get<string>(
      'CANVAS_CONSUMER_SECRET'
    );
    const check = createHmac('sha256', consumerSecretApp)
      .update(encoded_envelope)
      .digest('base64');

    if (check === consumerSecret) {
      const envelope = JSON.parse(
        Buffer.from(encoded_envelope, 'base64').toString('ascii')
      );
      // req.session.salesforce = envelope;
      console.log('got the session object:');
      console.log(envelope);
      console.log(JSON.stringify(envelope));
      return of({
        user: envelope.context.user.userName,
        envelope: JSON.stringify(envelope),
      });
    } else {
      return throwError('Authentication failed');
    }
  }
}
