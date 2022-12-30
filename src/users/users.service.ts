import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceKoService } from 'src/sentence-ko/sentence-ko.service';
import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entitiy';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private sentenceKoService: SentenceKoService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.hash = createUserDto.hash;
    Logger.verbose('User created...');
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async removeFavorite(id: number, sentencesIds: number[]): Promise<User> {
    const user = await this.findOne(id);
    user.subtitles = await this.getFavorite(id);
    user.subtitles = user.subtitles.filter((subtitle) => {
      return !sentencesIds.includes(subtitle.timeId);
    });
    const updated = await this.userRepository.manager.save(user);
    return updated;
  }

  async addFavorite(id: number, sentencesIds: number[]): Promise<User> {
    const user = await this.findOne(id);
    const sentences = await this.sentenceKoService.searchByIds(sentencesIds);
    user.subtitles = sentences;
    const updated = await this.userRepository.manager.save(user);
    return updated;
  }

  async getFavorite(id: number): Promise<SentenceKo[]> {
    const tableName = this.userRepository.metadata.tableName;
    const favorite = await this.userRepository
      .createQueryBuilder(tableName)
      .leftJoin(`${tableName}.subtitles`, `ko`)
      .addSelect([`ko.timeId`, `ko.subtitles`])
      .where(`${tableName}.id = :id`, { id: id })
      .getOne();
    return favorite.subtitles;
  }
}
