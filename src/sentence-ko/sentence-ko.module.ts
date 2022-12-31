import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentenceKo } from './sentenceKo.entity';
import { SentenceKoService } from './sentence-ko.service';
import { SentenceKoController } from './sentence-ko.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SentenceKo])],
  exports: [SentenceKoService],
  providers: [SentenceKoService],
  controllers: [SentenceKoController],
})
export class SentenceKoModule {}
