import { IsNotEmpty } from "class-validator";

export class InsertSentenceKoDto {
  @IsNotEmpty()
  timeId: number;
  
  sentence: string;
  pos: string;
}
