import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { SentenceKoService } from './sentence-ko.service';
import { SentenceKo } from './sentenceKo.entity';

describe('SentenceKoService', () => {
  let service: SentenceKoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentenceKoService,
        {
          provide: SentenceKoService,
          useClass: Repository<SentenceKo>,
        },
      ],
    }).compile();

    service = module.get<SentenceKoService>(SentenceKoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
