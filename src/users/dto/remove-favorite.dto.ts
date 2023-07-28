import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class RemoveFavorite {
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  ids: number[];
}
