import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentenceKo } from './sentenceKo.entity';
import { SentenceKoService } from './sentence-ko.service';
import { SentenceKoController } from './sentence-ko.controller';
import { ShowsModule } from 'src/shows/shows.module';

@Module({
  imports: [TypeOrmModule.forFeature([SentenceKo]), ShowsModule],
  exports: [SentenceKoService],
  providers: [SentenceKoService],
  controllers: [SentenceKoController],
})
export class SentenceKoModule {}
