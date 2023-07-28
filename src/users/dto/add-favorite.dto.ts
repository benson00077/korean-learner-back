import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AddFavorite {
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  ids: number[];
}
