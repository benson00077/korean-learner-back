import { Controller, Get, Post, Query } from '@nestjs/common';
import { InsertSentenceKoDto } from './dto/insert-sentence-ko.dto';
import { SentenceKoService } from './sentence-ko.service';
import * as mockSentenceKo from './mockSentenceKoData.json';
import { InsertResult } from 'typeorm';

@Controller('sentence-ko')
export class SentenceKoController {
  constructor(private readonly sentenceKoService: SentenceKoService) {}

  private parseJson2InsertDto(datas: typeof mockSentenceKo) {
    const parsed: InsertSentenceKoDto[] = datas.map((data) => {
      return {
        timeId: +`${data.chunckId}${data.startTime.replace(/\D/g, '')}`,
        sentence: JSON.stringify(data.subtitles),
        pos: JSON.stringify(data.pos),
      };
    });
    return parsed;
  }

  private async insertOne(data: InsertSentenceKoDto): Promise<InsertResult> {
    return await this.sentenceKoService.insert(data)
  }

  @Post('/insert?')
  insert(@Query('source') source: string): string {
    if(source !== 'local') return 'Invalid parameters'
    const parsed = this.parseJson2InsertDto(mockSentenceKo);
    parsed.forEach((data) => {
      this.insertOne(data)
    });
    return 'Insert done'
  }

  @Get()
  index(): string {
    return '<div> For json file </div>';
  }
}
