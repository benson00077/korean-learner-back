import { IsArray, IsNotEmpty } from "class-validator";

export class AddFavorite {
  @IsArray()
  @IsNotEmpty()
  ids: number[]
}