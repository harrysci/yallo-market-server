import { Test, TestingModule } from '@nestjs/testing';
import { SensService } from './sens.service';

describe('SensService', () => {
  let service: SensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensService],
    }).compile();

    service = module.get<SensService>(SensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
