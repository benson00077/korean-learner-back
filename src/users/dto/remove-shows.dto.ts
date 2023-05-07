import { IsArray, IsNotEmpty } from 'class-validator';

export class RemoveShows {
  @IsArray()
  @IsNotEmpty()
  showsNames: string[];
}
