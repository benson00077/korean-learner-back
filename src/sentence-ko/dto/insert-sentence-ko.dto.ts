import { IsNotEmpty } from 'class-validator';

export class InsertSentenceKoDto {
  @IsNotEmpty()
  timeId: number;
  subtitles: string[];
  subtitlesZh: string[];
  pos: string;
}
