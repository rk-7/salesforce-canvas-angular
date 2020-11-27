import { createHmac } from 'crypto';
interface AuthResult {
  req: any; user: any;
}
export class AuthService {
  constructor(private readonly canvasConsumerSecret?: string) {}
  checkAuthenticated(body: any): AuthResult {
    const bodyArray = body.signed_request.split('.');
    const consumerSecret = bodyArray[0];
    const encodedEnvelope = bodyArray[1];

    const check = this.getHmac(encodedEnvelope);
    if (check === consumerSecret) {
      const envelope = JSON.parse(
        Buffer.from(encodedEnvelope, 'base64').toString('ascii')
      );
      return {
        user: envelope.context.user.userName,
        req: JSON.stringify(envelope),
      };
    }
    throw Error('User is not authenticated');
  }

  private getHmac(encodedEnvelope: any): string {
    if (!this.canvasConsumerSecret) {
      throw Error('Canvas app is not configured properly!');
    }
    const check = createHmac('sha256', this.canvasConsumerSecret)
      .update(encodedEnvelope)
      .digest('base64');
    return check;
  }
}
