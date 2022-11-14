import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import { InsertSentenceKoDto } from './dto/insert-sentence-ko.dto';
import { SentenceKoService } from './sentence-ko.service';
import * as mockSentenceKo from './mockSentenceKoData.json';
import { TypeormFilter } from 'src/common/exceptions/typeorm/typeorm.filter';
import { SearchSentenceKoDto } from './dto/search-sentence-ko.dto';

@Controller('sentence-ko')
export class SentenceKoController {
  constructor(private readonly sentenceKoService: SentenceKoService) {}

  private parseJson2InsertDto(
    datas: typeof mockSentenceKo,
  ): InsertSentenceKoDto[] {
    const parsed = datas.map((data) => {
      return {
        timeId: +`${data.chunckId}${data.startTime.replace(/\D/g, '')}`,
        sentence: JSON.stringify(data.subtitles),
        pos: JSON.stringify(data.pos),
      };
    });
    return parsed;
  }

  @Post('/insert?')
  @UseFilters(TypeormFilter)
  insert(@Query('source') source: string) {
    if (source !== 'local') return 'Invalid parameters';
    const parsed = this.parseJson2InsertDto(mockSentenceKo);
    return this.sentenceKoService.insert(parsed);
  }

  @Get('/search')
  @UseFilters(TypeormFilter)
  searchByPosTag(@Body() datas: SearchSentenceKoDto) {
    return this.sentenceKoService.searchByPosTag(datas)
  }

  @Get()
  index(): string {
    return '<div> For json file </div>';
  }
}
