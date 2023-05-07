import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TypeormFilter } from 'src/common/exceptions/typeorm/typeorm.filter';
import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { AddFavorite } from './dto/add-favorite.dto';
import { RemoveFavorite } from './dto/remove-favorite.dto';
import { User } from './user.entitiy';
import { UsersService } from './users.service';
import { AddShows } from './dto/add-shows.dto';
import { Shows } from 'src/shows/shows.entity';
import { RemoveShows } from './dto/remove-shows.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.removeOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorite')
  @UseFilters(TypeormFilter)
  async addFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Body() sentences: AddFavorite,
  ): Promise<User> {
    const { ids } = sentences;
    return await this.usersService.addFavorite(id, ids);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorite')
  @UseFilters(TypeormFilter)
  async removeFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Body() sentences: RemoveFavorite,
  ): Promise<User> {
    const { ids } = sentences;
    return await this.usersService.removeFavorite(id, ids);
  }

  @Get(':id/favorite')
  @UseFilters(TypeormFilter)
  getFavorite(@Param('id', ParseIntPipe) id: number): Promise<SentenceKo[]> {
    return this.usersService.getFavorite(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/shows')
  @UseFilters(TypeormFilter)
  async addShows(
    @Param('id', ParseIntPipe) id: number,
    @Body() shows: AddShows,
  ): Promise<User> {
    const { showsNames } = shows;
    return await this.usersService.addShows(id, showsNames);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/shows')
  @UseFilters(TypeormFilter)
  async removeShows(
    @Param('id', ParseIntPipe) id: number,
    @Body() shows: RemoveShows,
  ): Promise<User> {
    const { showsNames } = shows;
    return await this.usersService.removeShows(id, showsNames);
  };
  
  @Get(':id/shows')
  getShows(@Param('id', ParseIntPipe) id:number): Promise<Shows[]> {
    return this.usersService.getShows(id)
  }
}
