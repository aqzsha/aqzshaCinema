import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Types } from 'mongoose';
import { GenreIdsDto } from './dto/genreIds.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    const movie = await this.movieService.bySlug(slug);
    if (!movie) {
      throw new NotFoundException('movie not found');
    }
    return movie;
  }

  @Get('by-actors/:actorId')
  async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
    const movie = await this.movieService.byActor(actorId);
    if (!movie) {
      throw new NotFoundException('movie not found');
    }
    return movie;
  }

  @Post('by-genres')
  @HttpCode(200)
  async byGenres(
    @Body('genreIds')
    genreIds: Types.ObjectId[],
  ) {
    return this.movieService.byGenres(genreIds);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Put('update-count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.movieService.byId(id);
  }

  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.movieService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateMovieDto,
  ) {
    const updateMovie = await this.movieService.update(id, dto);
    if (!updateMovie) throw new NotFoundException('Movie not found');
    return updateMovie;
  }

  @Delete(':id')
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedDoc = await this.movieService.delete(id);
    if (!deletedDoc) throw new NotFoundException('Movie not found');
  }
}
