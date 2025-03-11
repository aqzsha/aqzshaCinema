import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './movie.schema';
import { UserModule } from 'src/user/user.module';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
  imports: [
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
    UserModule,
    TelegramModule,
  ],
})
export class MovieModule {}
