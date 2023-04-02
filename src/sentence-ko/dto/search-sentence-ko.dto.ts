import { IsNotEmpty } from 'class-validator';

export class SearchSentenceKoDto {
  @IsNotEmpty()
  pos: string;

  @IsNotEmpty()
  tag: string;
}
