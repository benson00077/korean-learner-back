import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { SentenceKo } from './sentenceKo.entity';
import { InsertSentenceKoDto } from './dto/insert-sentence-ko.dto';
import { SearchSentenceKoDto } from './dto/search-sentence-ko.dto';
import { SearchSentenceContextDto } from './dto/search-sentence-context.dto';
import { ShowsService } from 'src/shows/shows.service';
import { SearchSentenceZhDto } from './dto/search-sentence-zh.dto';

@Injectable()
export class SentenceKoService {
  constructor(
    @InjectRepository(SentenceKo)
    private sentenceKoRepository: Repository<SentenceKo>,
    private showsServie: ShowsService,
  ) {}

  private queryValidator(query: string) {
    const good2Go = query.length > 1;
    const errMsg = new SentenceKo();
    errMsg.timeId = -1,
    errMsg.subtitles = [`Please input a longer word. Your previouse query word is: ${query}`]
    return { good2Go, errMsg: [errMsg] };
  }

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

  async searchByChinese(datas: SearchSentenceZhDto) {
    const { pos } = datas;
    const supportFullTextSearch = pos.length > 1;
    const tableName = this.sentenceKoRepository.metadata.tableName;
    const selectCols = [
      `${tableName}.timeId`,
      `${tableName}.subtitles`,
      `${tableName}.subtitlesZh`,
    ];
    let match = null;
    switch (supportFullTextSearch) {
      case false:
        match = await this.sentenceKoRepository
          .createQueryBuilder(tableName)
          .select(selectCols)
          .where(`${tableName}.subtitlesZh like :pos`, { pos: `%${pos}%` })
          .getMany();
        break;
      case true:
      default:
        /** SELECT * FROM sentenceKo WHERE MATCH(sentenceKo.subtitlesZh) AGAINST ('好吃'); */
        match = await this.sentenceKoRepository
          .createQueryBuilder(tableName)
          .select(selectCols)
          .where(`MATCH(${tableName}.subtitlesZh) AGAINST(:keyword)`, {
            keyword: pos,
          })
          .getMany();
    }
    return match;
  }

  async searchByPosTag(
    datas: SearchSentenceKoDto,
  ): Promise<SentenceKo[]> {
    const { pos, tag } = datas;
    const tableName = this.sentenceKoRepository.metadata.tableName;
    const selectCols = [
      `${tableName}.timeId`,
      `${tableName}.subtitles`,
      `${tableName}.subtitlesZh`,
    ];
    const { good2Go, errMsg } = this.queryValidator(pos);
    if (!good2Go) return errMsg;
    
    let match: SentenceKo[];
    switch (tag) {
      case 'VV':
      case 'VA':
        const posTrimmed = pos.slice(0, -1); // 먹다 > 먹
        match = await this.sentenceKoRepository
          .createQueryBuilder(tableName)
          .select(selectCols)
          .where(`${tableName}.pos like :pos`, {
            pos: `%${posTrimmed}\/${tag}%`,
          })
          .getMany();
        break;
      case 'NNG':
      default:
        match = await this.sentenceKoRepository
          // .createQueryBuilder()
          // .select() // select *
          .createQueryBuilder(tableName)
          .select(selectCols)
          .where(`MATCH(subtitles) AGAINST ('${pos}' IN BOOLEAN MODE)`)
          .andWhere(`${tableName}.pos like :tag`, { tag: `%${tag}%` })
          .getMany();
    }
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
    const timeRangeMs = timeRange * 1000000000; // timeid from 1000200:00:11.000 -> 10002000011000
    const [upperBound, lowerBound] = [timeId + timeRangeMs, timeId - timeRangeMs]
    const tableName = this.sentenceKoRepository.metadata.tableName;
    const match = await this.sentenceKoRepository
      .createQueryBuilder(tableName)
      .select([`${tableName}.timeId`, `${tableName}.subtitles`, `${tableName}.subtitlesZh`])
      .where(
        `${tableName}.timeId < ${upperBound} 
        AND ${tableName}.timeId > ${lowerBound}`,
      )
      .getMany();
    return match;
  }
}
