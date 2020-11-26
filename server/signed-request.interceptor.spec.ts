import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SignedRequestInterceptor } from './signed-request.interceptor';

describe('SignedRequestInterceptor', () => {
  let configService: ConfigService;
  let signedRequestInterceptor: SignedRequestInterceptor;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [ConfigService, SignedRequestInterceptor],
      }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
    signedRequestInterceptor = moduleRef.get<SignedRequestInterceptor>(SignedRequestInterceptor);
  });
  it('should be defined', () => {
    expect(signedRequestInterceptor).toBeDefined();
  });
});
