import { IsNotEmpty } from 'class-validator';

export class SearchSentenceZhDto {
  @IsNotEmpty()
  pos: string;
}
