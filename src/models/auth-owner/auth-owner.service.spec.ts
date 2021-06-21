import { Test, TestingModule } from '@nestjs/testing';
import { AuthOwnerService } from './auth-owner.service';

describe('AuthOwnerService', () => {
  let service: AuthOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthOwnerService],
    }).compile();

    service = module.get<AuthOwnerService>(AuthOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
