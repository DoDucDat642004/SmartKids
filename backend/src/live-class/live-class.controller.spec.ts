import { Test, TestingModule } from '@nestjs/testing';
import { LiveClassController } from './live-class.controller';
import { LiveClassService } from './live-class.service';

describe('LiveClassController', () => {
  let controller: LiveClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveClassController],
      providers: [LiveClassService],
    }).compile();

    controller = module.get<LiveClassController>(LiveClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
