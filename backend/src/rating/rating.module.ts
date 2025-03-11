import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingSchema } from './rating.schema';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
    MovieModule,
  ],
})
export class RatingModule {}
