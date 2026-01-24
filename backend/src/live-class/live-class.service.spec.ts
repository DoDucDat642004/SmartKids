import { Test, TestingModule } from '@nestjs/testing';
import { LiveClassService } from './live-class.service';

describe('LiveClassService', () => {
  let service: LiveClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveClassService],
    }).compile();

    service = module.get<LiveClassService>(LiveClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
