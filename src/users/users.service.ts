import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entitiy';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async remvoeFavorite(id: number, sentencesIds: number[]): Promise<void> {
    const tableName = this.userRepository.metadata.tableName;
    await this.userRepository
      .createQueryBuilder()
      .relation(SentenceKo, tableName)
      .of(sentencesIds)
      .remove(id);
  }

  async addFavorite(id: number, sentencesIds: number[]): Promise<void> {
    const tableName = this.userRepository.metadata.tableName;
    await this.userRepository
      .createQueryBuilder()
      .relation(SentenceKo, tableName)
      .of(sentencesIds)
      .add(id);
  }

  async getFavorite(id: number): Promise<SentenceKo[]> {
    //TODO use tableName
    const tableName = this.userRepository.metadata.tableName;
    const favorite = await this.userRepository
      .createQueryBuilder(tableName)
      .leftJoin(`${tableName}.sentences`, `ko`)
      .addSelect([`ko.pos`, `ko.sentences`])
      .where(`${tableName}.id = :id`, { id: id })
      .getOne();
    return favorite.sentences;
  }
}
