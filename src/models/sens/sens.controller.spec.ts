import { Test, TestingModule } from '@nestjs/testing';
import { SensController } from './sens.controller';

describe('SensController', () => {
  let controller: SensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensController],
    }).compile();

    controller = module.get<SensController>(SensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
