import { IsArray, IsNotEmpty } from 'class-validator';

export class RemoveFavorite {
  @IsArray()
  @IsNotEmpty()
  ids: number[];
}
