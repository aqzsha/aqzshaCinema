import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie } from './movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GenreIdsDto } from './dto/genreIds.dto';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel('Movie') private readonly MovieModel: Model<Movie>,
    private readonly telegramService: TelegramService,
  ) {}

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }

    return this.MovieModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('genres actors')
      .exec();
  }

  async bySlug(slug: string) {
    const movie = await this.MovieModel.findOne({ slug })
      .populate('genres actors')
      .exec();
    if (!movie) {
      throw new NotFoundException('movie not found');
    }
    return movie;
  }

  async byActor(actorId: Types.ObjectId) {
    const movie = await this.MovieModel.find({ actors: actorId }).exec();
    if (!movie) {
      throw new NotFoundException('movie not found');
    }
    return movie;
  }

  async byGenres(genreIds: Types.ObjectId[]) {
    return this.MovieModel.find({ genres: { $in: genreIds } }).exec();
  }

  async updateCountOpened(slug: string) {
    return this.MovieModel.findOneAndUpdate(
      { slug },
      { $inc: { countOpened: 1 } },
      { new: true },
    ).exec();
  }

  // Admin Area

  async byId(id: string) {
    return this.MovieModel.findById(id).exec();
  }

  async create() {
    const defaultValue: CreateMovieDto = {
      bigPoster: 'default_big_poster.jpg',
      actors: [],
      genres: [],
      poster: 'default_poster.jpg',
      title: 'Default Title',
      videoUrl: 'https://default.video/url',
      slug: 'default-title',
    };
    const movie = await this.MovieModel.create(defaultValue);
    return movie._id;
  }

  async update(id: string, dto: CreateMovieDto) {
    if (!dto.isSendTelegram) {
      await this.sendNotifications(dto);
      dto.isSendTelegram = true;
    }
    return this.MovieModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.MovieModel.findByIdAndDelete(id);
  }

  async getMostPopular() {
    return this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec();
  }

  async updateRating(id: string, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(
      id,
      { rating: newRating },
      { new: true },
    ).exec();
  }

  /* Utilites */
  async sendNotifications(dto: CreateMovieDto) {
    if (process.env.NODE_ENV !== 'development')
      await this.telegramService.sendPhoto(dto.poster);

    const msg = `<b>${dto.title}</b>`;

    await this.telegramService.sendMessage(msg, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: 'https://okko.tv/movie/free-guy',
              text: '🍿 Go to watch',
            },
          ],
        ],
      },
    });
  }
}
