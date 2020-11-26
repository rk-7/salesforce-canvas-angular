import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { Observable, of, throwError } from 'rxjs';


@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
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
