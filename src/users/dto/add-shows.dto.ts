import { IsArray, IsNotEmpty } from 'class-validator';

export class AddShows {
  @IsArray()
  @IsNotEmpty()
  showsNames: string[];
}
