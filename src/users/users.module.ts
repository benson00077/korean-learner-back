import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entitiy';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SentenceKoModule } from 'src/sentence-ko/sentence-ko.module';
import { SentenceKo } from 'src/sentence-ko/sentenceKo.entity';
import { ShowsModule } from 'src/shows/shows.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([SentenceKo]),
    SentenceKoModule,
    ShowsModule
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
