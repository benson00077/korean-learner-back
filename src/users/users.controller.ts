import {
  Body,
  Controller,
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
  addFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Body() sentences: AddFavorite,
  ): Promise<void> {
    let { ids } = sentences;
    let idsArr = JSON.parse(ids) as number[];
    return this.usersService.addFavorite(id, idsArr);
  }

  @Get(':id/favorite')
  @UseFilters(TypeormFilter)
  getavorite(@Param('id', ParseIntPipe) id: number): Promise<SentenceKo[]> {
    return this.usersService.getFavorite(id);
  }
}
let a = { ids: '[2000057849]' };
