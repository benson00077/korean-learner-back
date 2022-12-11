import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
} from '@nestjs/common';
import { TypeormFilter } from 'src/common/exceptions/typeorm/typeorm.filter';
import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { AddFavorite } from './dto/add-favorite.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RemoveFavorite } from './dto/remove-favorite.dto';
import { User } from './user.entitiy';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(TypeormFilter)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post(':id/favorite')
  @UseFilters(TypeormFilter)
  async addFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Body() sentences: AddFavorite,
  ): Promise<SentenceKo[]> {
    let { ids } = sentences;
    await this.usersService.addFavorite(id, ids);
    return this.usersService.getFavorite(id);
  }

  @Delete(':id/favorite')
  @UseFilters(TypeormFilter)
  async removeFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Body() sentences: RemoveFavorite,
  ): Promise<SentenceKo[]> {
    let { ids } = sentences;
    await this.usersService.removeFavorite(id, ids);
    return this.usersService.getFavorite(id);
  }

  @Get(':id/favorite')
  @UseFilters(TypeormFilter)
  getavorite(@Param('id', ParseIntPipe) id: number): Promise<SentenceKo[]> {
    return this.usersService.getFavorite(id);
  }
}
let a = { ids: '[2000057849]' };
