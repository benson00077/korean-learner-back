import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceKoService } from 'src/sentence-ko/sentence-ko.service';
import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { User } from './user.entitiy';
import { ShowsService } from 'src/shows/shows.service';
import { Shows } from 'src/shows/shows.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private sentenceKoService: SentenceKoService,
    private showsService: ShowsService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    Logger.verbose('User created...');
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({
      userId: id,
      isActive: '1',
    });
  }

  async removeOne(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      user.isActive = '2';
      await this.userRepository.save(user);
      //await this.userRepository.delete(id);
    }
  }

  async removeFavorite(id: number, sentencesIds: number[]): Promise<SentenceKo[]> {
    const user = await this.findOne(id);
    user.subtitles = await this.getFavorite(id);
    user.subtitles = user.subtitles.filter((subtitle) => {
      return !sentencesIds.includes(subtitle.timeId);
    });
    const updated = await this.userRepository.manager.save(user);
    return updated.subtitles;
  }

  async addFavorite(id: number, sentencesIds: number[]): Promise<SentenceKo[]> {
    const user = await this.findOne(id);
    const sentences = await this.sentenceKoService.searchByIds(sentencesIds);
    const existingSentences = await this.getFavorite(id);
    user.subtitles = [...existingSentences, ...sentences];
    const updated = await this.userRepository.manager.save(user);
    return updated.subtitles;
  }

  async getFavorite(id: number): Promise<SentenceKo[]> {
    const tableName = this.userRepository.metadata.tableName;
    const favorite = await this.userRepository
      .createQueryBuilder(tableName)
      .leftJoin(`${tableName}.subtitles`, `ko`)
      .addSelect([`ko.timeId`, `ko.subtitles`, `ko.subtitlesZh`])
      .where(`${tableName}.userId = :id`, { id: id })
      .getOne();
    return favorite.subtitles;
  }

  async addShows(id: number, showsNames: string[]): Promise<User> {
    const user = await this.findOne(id);
    const shows = await this.showsService.getMany(showsNames);
    user.shows = user.shows ? [...user.shows, ...shows] : shows;
    const udpated = await this.userRepository.manager.save(user);
    return udpated;
  }

  async removeShows(id: number, showsNames: string[]): Promise<User> {
    const user = await this.findOne(id);
    user.shows = await this.getShows(id);
    user.shows = user.shows.filter((show) => {
     return !showsNames.includes(show.name);
    });
    const updated = await this.userRepository.manager.save(user);
    return updated;
  }

  async getShows(id: number): Promise<Shows[]> {
    const tableName = this.userRepository.metadata.tableName;
    const user = await this.userRepository
      .createQueryBuilder(tableName)
      .leftJoinAndSelect(`${tableName}.shows`, 'show')
      .where(`${tableName}.userId = :id`, { id: id })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user.shows;
  }
}
