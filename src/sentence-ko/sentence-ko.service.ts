import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { SentenceKo } from './sentenceKo.entity';
import { InsertSentenceKoDto } from './dto/insert-sentence-ko.dto';

//TODO
// Python 那邊，直接 txt/srt 轉 json
// 只接收如下格式
let data = {
  timeID: 1011054041,
  sentences: ['누군가 세상 쪽으로', '등을 떠밀어 주었다면'],
  pos: ['', '', ''],
};

@Injectable()
export class SentenceKoService {
  constructor(
    @InjectRepository(SentenceKo)
    private sentenceKoRepository: Repository<SentenceKo>,
  ) {}


	insert(insertDto: InsertSentenceKoDto): Promise<InsertResult> {
		const sentenceKo = new SentenceKo();
    sentenceKo.timeId = insertDto.timeId
    sentenceKo.sentences = insertDto.sentence;
    sentenceKo.pos = insertDto.pos;

    console.log('Inserting setence in Korean...')

    const inserted = this.sentenceKoRepository
      .createQueryBuilder()
      .insert()
      .into(SentenceKo)
      .values(sentenceKo)
      .execute()

    return inserted
	}
}
