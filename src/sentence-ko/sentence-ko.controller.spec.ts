import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { SentenceKoController } from './sentence-ko.controller';
import { SentenceKoService } from './sentence-ko.service';
import { SentenceKo } from './sentenceKo.entity';

describe('SentenceKoController', () => {
  let controller: SentenceKoController;
  let service: SentenceKoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentenceKoController],
      providers: [
        {
          provide: SentenceKoService,
          useClass: Repository<SentenceKo>,
        },
      ],
    }).compile();

    controller = module.get<SentenceKoController>(SentenceKoController);
    service = module.get<SentenceKoService>(SentenceKoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
