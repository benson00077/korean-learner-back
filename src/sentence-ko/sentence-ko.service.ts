import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { SentenceKo } from './sentenceKo.entity';
import { InsertSentenceKoDto } from './dto/insert-sentence-ko.dto';
import { SearchSentenceKoDto } from './dto/search-sentence-ko.dto';
import { SearchSentenceContextDto } from './dto/search-sentence-context.dto';
import { ShowsService } from 'src/shows/shows.service';

@Injectable()
export class SentenceKoService {
  constructor(
    @InjectRepository(SentenceKo)
    private sentenceKoRepository: Repository<SentenceKo>,
    private showsServie: ShowsService,
  ) {}

  async insert(
    showData: InsertSentenceKoDto[][],
    showNames: string[],
  ): Promise<InsertResult> {
    const sentencesKo: SentenceKo[] = [];
    await Promise.all(
      showData.map(async (episodeData, i) => {
        const show = await this.showsServie.getOne(showNames[i]);
        episodeData.forEach((subtitles) => {
          const sentenceKo = new SentenceKo();
          sentenceKo.timeId = subtitles.timeId;
          sentenceKo.subtitles = subtitles.subtitles;
          sentenceKo.subtitlesZh = subtitles.subtitlesZh;
          sentenceKo.pos = subtitles.pos;
          sentenceKo.show = show;
          sentencesKo.push(sentenceKo);
        });
      }),
    );
    Logger.verbose('Inserting setence in Korean...');
    const inserted = await this.sentenceKoRepository
      .createQueryBuilder()
      .insert()
      .into(SentenceKo)
      .values(sentencesKo)
      .orUpdate(['timeId', 'subtitles', 'subtitlesZh', 'pos'])
      .execute();
    return inserted.raw;
  }

  async searchByPosTag(datas: SearchSentenceKoDto) {
    const { pos, tag } = datas;
    const tableName = this.sentenceKoRepository.metadata.tableName;
    const match = await this.sentenceKoRepository
      // .createQueryBuilder()
      // .select() // select *
      .createQueryBuilder(tableName)
      .select([`${tableName}.timeId`, `${tableName}.subtitles`])
      .where(`MATCH(subtitles) AGAINST ('${pos}' IN BOOLEAN MODE)`)
      .andWhere(`${tableName}.pos like :tag`, { tag: `%${tag}%` })
      .getMany();
    return match;
  }

  async searchByIds(ids: number[]): Promise<SentenceKo[]> {
    const match = await this.sentenceKoRepository.find({
      select: { timeId: true, subtitles: true },
      where: ids.map((id) => ({ timeId: id })),
    });
    return match;
  }

  async searchSentenceContext(
    datas: SearchSentenceContextDto,
  ): Promise<SentenceKo[]> {
    const { timeId, timeRange } = datas;
    const timeRangeMs = timeRange * 1000;
    const tableName = this.sentenceKoRepository.metadata.tableName;
    const match = await this.sentenceKoRepository
      .createQueryBuilder(tableName)
      .select([`${tableName}.timeId`, `${tableName}.subtitles`])
      .where(
        `${tableName}.timeId < ${timeId + timeRangeMs} 
        OR ${tableName}.timeId > ${timeId - timeRangeMs}`,
      )
      .getMany();
    return match;
  }
}
