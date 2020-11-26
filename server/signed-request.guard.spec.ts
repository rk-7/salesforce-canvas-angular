import { SignedRequestGuard } from './signed-request.guard';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
describe('SignedRequestGuard', () => {
  let configService: ConfigService;
  let signedRequestGuard: SignedRequestGuard;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        providers: [ConfigService, SignedRequestGuard],
      }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
    signedRequestGuard = moduleRef.get<SignedRequestGuard>(SignedRequestGuard);
  });
  it('should be defined', () => {
    expect(signedRequestGuard).toBeDefined();
  });
});
