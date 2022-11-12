import { Test, TestingModule } from '@nestjs/testing';
import { SentenceKoController } from './sentence-ko.controller';

describe('SentenceKoController', () => {
  let controller: SentenceKoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentenceKoController],
    }).compile();

    controller = module.get<SentenceKoController>(SentenceKoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
