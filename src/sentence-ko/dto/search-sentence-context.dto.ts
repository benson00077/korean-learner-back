import { IsNotEmpty, IsNumber, Max } from 'class-validator';

export class SearchSentenceContextDto {
  @IsNotEmpty()
  @IsNumber()
  timeId: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(20)
  timeRange: number;
}
