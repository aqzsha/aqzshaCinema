import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Genre } from './genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { IGenre } from './genre.interface';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel('Genre') private readonly GenreModel: Model<Genre>,
    private readonly movieService: MovieService,
  ) {}

  async getAll(searchTerm?: string) {
    let options = {};

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i'),
          },
          {
            slug: new RegExp(searchTerm, 'i'),
          },
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      };
    }
    return this.GenreModel.find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async bySlug(slug: string) {
    const genre = await this.GenreModel.findOne({ slug }).exec();
    if (!genre) {
      throw new NotFoundException('Genre not found!');
    }
    return genre;
  }

  async getPopular() {
    return this.GenreModel.find()
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec();
  }

  async getCollections() {
    const genres = await this.getAll();

    const collections = await Promise.all(
      genres.map(async (genre) => {
        if (!genre._id) {
          return null;
        }
        const genreId = new Types.ObjectId(genre._id.toString());
        const moviesByGenre = await this.movieService.byGenres([genreId]);

        const result: IGenre = {
          _id: String(genre._id),
          title: genre.name,
          slug: genre.slug,
          image: moviesByGenre[0].bigPoster,
        };

        return result;
      }),
    );

    return collections;
  }

  //   Admin area

  async byId(_id: string) {
    return this.GenreModel.findById(_id).exec();
  }

  async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    };
    const genre = await this.GenreModel.create(defaultValue);
    return genre._id;
  }

  async update(id: string, dto: CreateGenreDto) {
    return this.GenreModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.GenreModel.findByIdAndDelete(id).exec();
  }
}
