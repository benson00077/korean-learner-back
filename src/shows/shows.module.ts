import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shows } from './shows.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shows])
  ],
  exports: [ShowsService],
  providers: [ShowsService],
  controllers: [ShowsController]
})
export class ShowsModule {}
