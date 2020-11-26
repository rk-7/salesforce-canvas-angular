import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { Request } from 'express';
import { Observable, of, throwError } from 'rxjs';

@Injectable()
export class SignedRequestGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const body = context.switchToHttp().getRequest<Request>().body;
    console.log('body is', body);
    return this.checkAuthenticated(body);
  }
  checkAuthenticated(body: any): Observable<boolean> {
    const bodyArray = body.signed_request.split('.');
    const consumerSecret = bodyArray[0];
    const encoded_envelope = bodyArray[1];
    const consumerSecretApp = this.configService.get<string>('CANVAS_CONSUMER_SECRET');
    const check = createHmac('sha256', consumerSecretApp).update(encoded_envelope).digest('base64');

    if (check === consumerSecret) {
        const envelope = JSON.parse(Buffer.from(encoded_envelope, 'base64').toString('ascii'));
        // req.session.salesforce = envelope;
        console.log('got the session object:');
        console.log(envelope);
        console.log(JSON.stringify(envelope) );
        return of(true);
    } else {
        return throwError('Authentication failed');
    }
  }
}
