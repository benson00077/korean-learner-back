import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Shows } from './shows.entity';

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(Shows)
    private showsRepository: Repository<Shows>,
  ) {}

  private async findOneByShowName(showName: string): Promise<Shows> {
    return this.showsRepository.findOneBy({ name: showName });
  }

  private async findManyByShowName(showsNames: string[]): Promise<Shows[]> {
    return this.showsRepository.find({
      where: {
        name: In(showsNames),
      },
    });
  }

  private async addOne(showName: string): Promise<Shows> {
    const show = new Shows();
    show.name = showName;
    Logger.verbose('New show created...');
    return this.showsRepository.save(show);
  }

  public async getOne(showName: string): Promise<Shows> {
    const show = await this.findOneByShowName(showName);
    if (show) return show;
    return this.addOne(showName);
  }

  public async getMany(showsNames: string[]): Promise<Shows[]> {
    const shows = await this.findManyByShowName(showsNames);
    return shows;
  }
}
