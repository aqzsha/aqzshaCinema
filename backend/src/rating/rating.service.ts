import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingModel } from './rating.schema';
import { Model, Types } from 'mongoose';
import { MovieService } from 'src/movie/movie.service';
import { SetRatingDto } from './dto/set-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel('Rating') private readonly RatingModel: Model<Rating>,
    private readonly movieService: MovieService,
  ) {}

  async averageRatingbyMovie(movieId: Types.ObjectId | string) {
    const ratingsMovie: Rating[] = await this.RatingModel.aggregate()
      .match({ movieId: new Types.ObjectId(movieId) })
      .exec();

    return (
      ratingsMovie.reduce((acc, item) => acc + item.value, 0) /
      ratingsMovie.length
    );
  }

  async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
    const { movieId, value } = dto;
    const newRating = await this.RatingModel.findOneAndUpdate(
      { movieId, userId },
      { userId, movieId, value },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const averageRating = await this.averageRatingbyMovie(movieId);

    await this.movieService.updateRating(movieId, averageRating);

    return newRating;
  }

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.RatingModel.findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0));
  }
}
