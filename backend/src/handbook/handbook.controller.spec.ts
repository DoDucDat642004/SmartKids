import { Test, TestingModule } from '@nestjs/testing';
import { HandbookController } from './handbook.controller';
import { HandbookService } from './handbook.service';

describe('HandbookController', () => {
  let controller: HandbookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HandbookController],
      providers: [HandbookService],
    }).compile();

    controller = module.get<HandbookController>(HandbookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
