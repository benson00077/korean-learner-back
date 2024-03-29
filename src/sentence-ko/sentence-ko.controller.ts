import {
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { InsertSentenceKoDto } from './dto/insert-sentence-ko.dto';
import { SentenceKoService } from './sentence-ko.service';
import { TypeormFilter } from 'src/common/exceptions/typeorm/typeorm.filter';
import { SearchSentenceKoDto } from './dto/search-sentence-ko.dto';
import { SearchSentenceContextDto } from './dto/search-sentence-context.dto';
import * as fs from 'fs';
import * as path from 'path';
import { SourceJsonDto } from './dto/source-json.dto';
import { SearchSentenceZhDto } from './dto/search-sentence-zh.dto';

@Controller('sentences')
export class SentenceKoController {
  constructor(private readonly sentenceKoService: SentenceKoService) {}

  private parseJson2InsertDto(
    sourceJson: SourceJsonDto,
  ): InsertSentenceKoDto[] {
    const parsed = [];
    sourceJson.episodes.forEach((episode, i) => {
      episode.forEach((entity, j) => {
        // episode is 0-indexed
        const epIndex = (i + 1 + '').padStart(3, '0');
        const chunckId = (j + '').padStart(4, '0');
        parsed.push({
          timeId: +`${epIndex}${chunckId}${entity.startTime.replace(
            /\D/g,
            '',
          )}`,
          subtitles: entity.subtitles,
          subtitlesZh: entity.subtitlesZh,
          pos: JSON.stringify(entity.pos),
        });
      });
    });
    return parsed;
  }

  private getShowName(sourceJson: SourceJsonDto): string {
    return sourceJson.show;
  }

  @Post('/insert?')
  @UseFilters(TypeormFilter)
  insert(@Query('source') source: string) {
    if (source !== 'local') return 'Invalid parameters';
    const dirPath = path.resolve('src', 'assets', 'seeds');
    const jsonFiles = fs
      .readdirSync(dirPath)
      .filter((file) => /\.json/.test(file));
    const parsedJsons = jsonFiles.map((fileName) => {
      const json = require(path.join(dirPath, fileName));
      return this.parseJson2InsertDto(json);
    });
    const showNames = jsonFiles.map((fileName) => {
      const json = require(path.join(dirPath, fileName));
      return this.getShowName(json);
    });
    return this.sentenceKoService.insert(parsedJsons, showNames);
  }

  @Get('/zh')
  @UseFilters(TypeormFilter)
  searchByChinese(@Query() params: SearchSentenceZhDto) {
    return this.sentenceKoService.searchByChinese(params);
  }

  @Get('/ko')
  @UseFilters(TypeormFilter)
  searchByPosTag(@Query() params: SearchSentenceKoDto) {
    return this.sentenceKoService.searchByPosTag(params);
  }

  @Get('/context')
  @UseFilters(TypeormFilter)
  searchSentenceContext(
    @Query('timeId', ParseIntPipe) timeId: number,
    @Query('timeRange', ParseIntPipe) timeRange: number,
  ) {
    const params: SearchSentenceContextDto = { timeId, timeRange };
    return this.sentenceKoService.searchSentenceContext(params);
  }

  @Get()
  index(): string {
    return '<div> For json file </div>';
  }
}
