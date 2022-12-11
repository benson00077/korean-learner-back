import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { SentenceKo } from './sentenceKo.entity';
import { InsertSentenceKoDto } from './dto/insert-sentence-ko.dto';
import { SearchSentenceKoDto } from './dto/search-sentence-ko.dto';
import { SearchSentenceContextDto } from './dto/search-sentence-context.dto';

@Injectable()
export class SentenceKoService {
  constructor(
    @InjectRepository(SentenceKo)
    private sentenceKoRepository: Repository<SentenceKo>,
  ) {}

  insert(datas: InsertSentenceKoDto[]): Promise<InsertResult> {
    const sentencesKo: SentenceKo[] = [];
    datas.forEach((data) => {
      sentencesKo.push({
        timeId: data.timeId,
        sentences: data.sentence,
        pos: data.pos,
        users: null,
      });
    });
    Logger.verbose('Inserting setence in Korean...');
    const inserted = this.sentenceKoRepository
      .createQueryBuilder()
      .insert()
      .into(SentenceKo)
      .values(sentencesKo)
      .execute();

    return inserted;
  }

  async searchByPosTag(datas: SearchSentenceKoDto): Promise<SentenceKo[]> {
    const { pos, tag } = datas;
    const tableName = this.sentenceKoRepository.metadata.tableName
    const match = await this.sentenceKoRepository
      // .createQueryBuilder()
      // .select() // select * 
      .createQueryBuilder(tableName)
      .select(`${tableName}.timeId`)
      .where(`MATCH(sentences) AGAINST ('${pos}' IN BOOLEAN MODE)`)
      .andWhere(`${tableName}.pos like :tag`, {tag: `%${tag}%`})
      .getMany();
    return match
  }

  async searchSentenceContext(datas: SearchSentenceContextDto): Promise<SentenceKo[]> {
    const { timeId, timeRange } = datas;
    const timeRangeMs = timeRange * 1000
    const tableName = this.sentenceKoRepository.metadata.tableName
    const match = await this.sentenceKoRepository
      .createQueryBuilder(tableName)
      .select([`${tableName}.timeId`, `${tableName}.sentences`])
      .where(`${tableName}.timeId < ${timeId + timeRangeMs} 
        OR ${tableName}.timeId > ${timeId - timeRangeMs}` )
      .getMany()
    return match
  }
}
