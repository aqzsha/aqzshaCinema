import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreSchema } from './genre.schema';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports: [
    MongooseModule.forFeature([{ name: 'Genre', schema: GenreSchema }]),
    MovieModule,
  ],
})
export class GenreModule {}
