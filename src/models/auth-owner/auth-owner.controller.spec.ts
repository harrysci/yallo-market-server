import { Test, TestingModule } from '@nestjs/testing';
import { AuthOwnerController } from './auth-owner.controller';

describe('AuthOwnerController', () => {
  let controller: AuthOwnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthOwnerController],
    }).compile();

    controller = module.get<AuthOwnerController>(AuthOwnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
