import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
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
import { passportUser } from 'src/auth/interface/passport.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  removeOne(@Request() req): Promise<void> {
    const passportUser: passportUser = req.user;
    return this.usersService.removeOne(passportUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/favorite')
  @UseFilters(TypeormFilter)
  async addFavorite(
    @Request() req,
    @Body() sentences: AddFavorite,
  ): Promise<User> {
    const passportUser: passportUser = req.user;
    const { ids } = sentences;
    return await this.usersService.addFavorite(passportUser.userId, ids);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/favorite')
  @UseFilters(TypeormFilter)
  async removeFavorite(
    @Request() req,
    @Body() sentences: RemoveFavorite,
  ): Promise<User> {
    const passportUser: passportUser = req.user;
    const { ids } = sentences;
    return await this.usersService.removeFavorite(passportUser.userId, ids);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/favorite')
  @UseFilters(TypeormFilter)
  getFavorite(@Request() req): Promise<SentenceKo[]> {
    const passportUser: passportUser = req.user;
    return this.usersService.getFavorite(passportUser.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/shows')
  @UseFilters(TypeormFilter)
  async addShows(@Request() req, @Body() shows: AddShows): Promise<User> {
    const passportUser: passportUser = req.user;
    const { showsNames } = shows;
    return await this.usersService.addShows(passportUser.userId, showsNames);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/shows')
  @UseFilters(TypeormFilter)
  async removeShows(@Request() req, @Body() shows: RemoveShows): Promise<User> {
    const passportUser: passportUser = req.user;
    const { showsNames } = shows;
    return await this.usersService.removeShows(passportUser.userId, showsNames);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/shows')
  async getShows(@Request() req): Promise<Shows[]> {
    const passportUser: passportUser = req.user;
    return this.usersService.getShows(passportUser.userId);
  }
}
