import { Test, TestingModule } from '@nestjs/testing';
import { SentenceKoService } from './sentence-ko.service';

describe('SentenceKoService', () => {
  let service: SentenceKoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentenceKoService],
    }).compile();

    service = module.get<SentenceKoService>(SentenceKoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
